CREATE TABLE criterio (
    id_criterio SERIAL PRIMARY KEY,

    id_rubrica_materia INT NOT NULL,
    id_competencia INT NOT NULL,
    id_parcial INT NOT NULL,

    descripcion TEXT NOT NULL,

    porcentaje NUMERIC(5,2) NOT NULL,

    CONSTRAINT fk_criterio_rubrica
        FOREIGN KEY(id_rubrica_materia)
        REFERENCES rubrica_materia(id_rubrica_materia),

    CONSTRAINT fk_criterio_competencia
        FOREIGN KEY(id_competencia)
        REFERENCES competencia(id_competencia),

    CONSTRAINT fk_criterio_parcial
        FOREIGN KEY(id_parcial)
        REFERENCES parcial(id_parcial),

    CONSTRAINT chk_porcentaje
        CHECK (porcentaje BETWEEN 0 AND 100)
);