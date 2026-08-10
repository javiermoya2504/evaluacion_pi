CREATE INDEX idx_evaluacion_estado_parcial
ON evaluacion(estado, id_parcial);

CREATE INDEX idx_evaluacion_equipo
ON evaluacion(id_equipo);

CREATE INDEX idx_detalle_evaluacion_criterio
ON detalle_evaluacion(id_evaluacion, id_criterio);

CREATE INDEX idx_criterio_rubrica
ON criterio(id_rubrica_materia);

CREATE INDEX idx_rubrica_materia_materia
ON rubrica_materia(id_materia);