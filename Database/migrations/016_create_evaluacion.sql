CREATE TABLE evaluacion (
    id_evaluacion SERIAL PRIMARY KEY,

    id_equipo INT NOT NULL,
    id_docente INT NOT NULL,
    id_rubrica_global INT NOT NULL,
    id_parcial INT NOT NULL,

    fecha_evaluacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    estado VARCHAR(20) DEFAULT 'borrador',

    calificacion_total NUMERIC(5,2) DEFAULT 0,

    CONSTRAINT fk_evaluacion_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo),

    CONSTRAINT fk_evaluacion_docente
        FOREIGN KEY (id_docente)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_evaluacion_rubrica_global
        FOREIGN KEY (id_rubrica_global)
        REFERENCES rubrica_global(id_rubrica_global),

    CONSTRAINT fk_evaluacion_parcial
        FOREIGN KEY (id_parcial)
        REFERENCES parcial(id_parcial),

    CONSTRAINT chk_evaluacion_total
        CHECK (calificacion_total BETWEEN 0 AND 100),

    CONSTRAINT chk_evaluacion_estado
        CHECK (estado IN ('borrador', 'finalizada'))
);