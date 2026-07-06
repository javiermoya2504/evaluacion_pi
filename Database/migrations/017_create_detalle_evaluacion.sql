CREATE TABLE detalle_evaluacion (
    id_detalle_evaluacion SERIAL PRIMARY KEY,

    id_evaluacion INT NOT NULL,
    id_criterio INT NOT NULL,

    calificacion NUMERIC(5,2) NOT NULL,

    observacion TEXT,

    CONSTRAINT fk_detalle_evaluacion
        FOREIGN KEY (id_evaluacion)
        REFERENCES evaluacion(id_evaluacion)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_criterio
        FOREIGN KEY (id_criterio)
        REFERENCES criterio(id_criterio),

    CONSTRAINT chk_detalle_calificacion
        CHECK (calificacion BETWEEN 0 AND 100),

    CONSTRAINT uq_evaluacion_criterio
        UNIQUE (id_evaluacion, id_criterio)
);