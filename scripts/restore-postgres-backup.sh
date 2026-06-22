#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
}

usage() {
  cat <<'USAGE'
Usage:
  BACKUP_ENV_FILE=/etc/evaluacion-pi/backup.env RESTORE_DATABASE_URL=postgresql://... ./scripts/restore-postgres-backup.sh <backup.dump.gz>

Options through environment:
  RESTORE_DATABASE_URL  Required target database URL. Never point it to production during tests.
  BACKUP_ENV_FILE       Optional env file with binary overrides.
  PG_RESTORE_BIN        Optional path to pg_restore.
  DRY_RUN=1             Validate inputs without restoring.
USAGE
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Required command not found: $1"
}

load_env_file() {
  if [[ -n "${BACKUP_ENV_FILE:-}" ]]; then
    [[ -f "$BACKUP_ENV_FILE" ]] || fail "BACKUP_ENV_FILE does not exist: $BACKUP_ENV_FILE"
    set -a
    # shellcheck disable=SC1090
    source "$BACKUP_ENV_FILE"
    set +a
  fi
}

[[ "${1:-}" != "-h" && "${1:-}" != "--help" ]] || {
  usage
  exit 0
}

backup_path="${1:-}"
[[ -n "$backup_path" ]] || {
  usage
  exit 1
}

load_env_file

PG_RESTORE_BIN="${PG_RESTORE_BIN:-pg_restore}"
DRY_RUN="${DRY_RUN:-0}"

require_command "$PG_RESTORE_BIN"
require_command gzip

[[ -f "$backup_path" ]] || fail "Backup file not found: $backup_path"
[[ -s "$backup_path" ]] || fail "Backup file is empty: $backup_path"
[[ -n "${RESTORE_DATABASE_URL:-}" ]] || fail "Set RESTORE_DATABASE_URL with the target database URL"

if [[ "$DRY_RUN" == "1" ]]; then
  log "DRY_RUN enabled. Restore inputs are valid."
  log "Backup would be restored from: $backup_path"
  exit 0
fi

log "Restoring backup into target database"
gzip -dc "$backup_path" | "$PG_RESTORE_BIN" --clean --if-exists --no-owner --no-acl --dbname "$RESTORE_DATABASE_URL"
log "Restore completed"
