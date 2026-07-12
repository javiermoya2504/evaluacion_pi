-- Sprint 8 - Indices para lecturas y joins con riesgo de lentitud.
-- PostgreSQL no crea indices automaticamente para columnas FK.

CREATE INDEX IF NOT EXISTS idx_usuario_rol
ON usuario(id_rol);

CREATE INDEX IF NOT EXISTS idx_usuario_carrera
ON usuario(id_carrera);

CREATE INDEX IF NOT EXISTS idx_docente_materia_usuario
ON docente_materia(id_usuario);

CREATE INDEX IF NOT EXISTS idx_criterio_rubrica_materia
ON criterio(id_rubrica_materia);

CREATE INDEX IF NOT EXISTS idx_rubrica_global_parcial
ON rubrica_global(id_parcial);

CREATE INDEX IF NOT EXISTS idx_rubrica_global_usuario_creador
ON rubrica_global(id_usuario_creador);

CREATE INDEX IF NOT EXISTS idx_rubrica_global_criterio_criterio
ON rubrica_global_criterio(id_criterio);

CREATE INDEX IF NOT EXISTS idx_proyecto_carrera
ON proyecto(id_carrera);

CREATE INDEX IF NOT EXISTS idx_equipo_proyecto
ON equipo(id_proyecto);

CREATE INDEX IF NOT EXISTS idx_equipo_usuario_usuario
ON equipo_usuario(id_usuario);
