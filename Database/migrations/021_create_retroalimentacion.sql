CREATE TABLE retroalimentacion (
    id_retroalimentacion SERIAL PRIMARY KEY,

    id_evaluacion INT NOT NULL,
    id_equipo INT NOT NULL,
    id_docente INT NOT NULL,

    comentario TEXT NOT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    activo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_retroalimentacion_evaluacion
        FOREIGN KEY (id_evaluacion)
        REFERENCES evaluacion(id_evaluacion)
        ON DELETE CASCADE,

    CONSTRAINT fk_retroalimentacion_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo),

    CONSTRAINT fk_retroalimentacion_docente
        FOREIGN KEY (id_docente)
        REFERENCES usuario(id_usuario),

    CONSTRAINT uq_retroalimentacion_evaluacion_docente
        UNIQUE (id_evaluacion, id_docente)
);