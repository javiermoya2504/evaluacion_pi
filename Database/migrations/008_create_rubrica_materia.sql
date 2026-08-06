CREATE TABLE rubrica_materia (
    id_rubrica_materia SERIAL PRIMARY KEY,

    id_materia INT NOT NULL,

    nombre VARCHAR(150) NOT NULL,

    porcentaje_total NUMERIC(5,2),

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_rubrica_materia
        FOREIGN KEY(id_materia)
        REFERENCES materia(id_materia),

    CONSTRAINT chk_porcentaje_total
        CHECK (porcentaje_total BETWEEN 0 AND 100)
);