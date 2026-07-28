CREATE INDEX idx_evaluacion_equipo_fecha
ON evaluacion(id_equipo, fecha_evaluacion);

CREATE INDEX idx_evaluacion_docente
ON evaluacion(id_docente);

CREATE INDEX idx_detalle_evaluacion
ON detalle_evaluacion(id_evaluacion);

CREATE INDEX idx_detalle_criterio
ON detalle_evaluacion(id_criterio);