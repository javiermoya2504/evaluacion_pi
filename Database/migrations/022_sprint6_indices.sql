CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_retroalimentacion_equipo
ON retroalimentacion(id_equipo);

CREATE INDEX idx_retroalimentacion_docente
ON retroalimentacion(id_docente);

CREATE INDEX idx_retroalimentacion_evaluacion
ON retroalimentacion(id_evaluacion);

CREATE INDEX idx_retroalimentacion_fecha
ON retroalimentacion(fecha_creacion);

CREATE INDEX idx_retroalimentacion_comentario_trgm
ON retroalimentacion
USING GIN (comentario gin_trgm_ops);