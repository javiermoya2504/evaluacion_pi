CREATE TABLE docente_materia (
    id_docente_materia SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,
    id_materia INT NOT NULL,

    CONSTRAINT fk_docente_usuario
        FOREIGN KEY(id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT fk_docente_materia
        FOREIGN KEY(id_materia)
        REFERENCES materia(id_materia),

    CONSTRAINT uq_docente_materia
        UNIQUE(id_usuario,id_materia)
);