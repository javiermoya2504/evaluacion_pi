CREATE INDEX idx_audit_fecha
ON audit_log(fecha);

CREATE INDEX idx_audit_usuario
ON audit_log(id_usuario);

CREATE INDEX idx_audit_tabla
ON audit_log(tabla);