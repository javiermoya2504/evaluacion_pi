CREATE INDEX idx_criterio_parcial
ON criterio(id_parcial);

CREATE INDEX idx_criterio_competencia
ON criterio(id_competencia);

CREATE INDEX idx_rubrica_materia
ON rubrica_materia(id_materia);

CREATE INDEX idx_docente_materia
ON docente_materia(id_materia);