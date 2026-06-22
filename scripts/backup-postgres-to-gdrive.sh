#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[%s] %s\n' "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" "$*"
}

fail() {
  log "ERROR: $*"
  exit 1
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

load_env_file

PG_DUMP_BIN="${PG_DUMP_BIN:-pg_dump}"
RCLONE_BIN="${RCLONE_BIN:-rclone}"
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
BACKUP_PREFIX="${BACKUP_PREFIX:-evaluacion_pi}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DRY_RUN="${DRY_RUN:-0}"

require_command "$PG_DUMP_BIN"
require_command "$RCLONE_BIN"
require_command gzip
require_command find

[[ -n "${DATABASE_URL:-}" || -n "${PGDATABASE:-}" ]] || fail "Set DATABASE_URL or PGDATABASE/PGHOST/PGUSER variables"
[[ -n "${RCLONE_REMOTE:-}" ]] || fail "Set RCLONE_REMOTE with the Google Drive remote name"
[[ -n "${RCLONE_BACKUP_PATH:-}" ]] || fail "Set RCLONE_BACKUP_PATH with the Google Drive folder path"
[[ "$BACKUP_RETENTION_DAYS" =~ ^[0-9]+$ ]] || fail "BACKUP_RETENTION_DAYS must be numeric"

remote_target="${RCLONE_REMOTE}:${RCLONE_BACKUP_PATH}"
timestamp="$(date -u '+%Y%m%dT%H%M%SZ')"
backup_file="${BACKUP_PREFIX}_${timestamp}.dump.gz"
backup_path="${BACKUP_DIR}/${backup_file}"

if [[ "$DRY_RUN" == "1" ]]; then
  log "DRY_RUN enabled. Configuration is valid."
  log "Backup would be written to: $backup_path"
  log "Backup would be uploaded to: $remote_target"
  exit 0
fi

umask 077
mkdir -p "$BACKUP_DIR"

log "Creating PostgreSQL backup: $backup_path"
if [[ -n "${DATABASE_URL:-}" ]]; then
  "$PG_DUMP_BIN" --format=custom --no-owner --no-acl "$DATABASE_URL" | gzip -c > "$backup_path"
else
  "$PG_DUMP_BIN" --format=custom --no-owner --no-acl | gzip -c > "$backup_path"
fi

[[ -s "$backup_path" ]] || fail "Backup file is empty: $backup_path"

log "Uploading backup to Google Drive remote: $remote_target"
"$RCLONE_BIN" copy "$backup_path" "$remote_target" --create-empty-src-dirs --checksum

if (( BACKUP_RETENTION_DAYS > 0 )); then
  log "Removing local backups older than ${BACKUP_RETENTION_DAYS} days"
  find "$BACKUP_DIR" -type f -name "${BACKUP_PREFIX}_*.dump.gz" -mtime +"$BACKUP_RETENTION_DAYS" -print -delete
fi

log "Backup completed: $backup_file"
