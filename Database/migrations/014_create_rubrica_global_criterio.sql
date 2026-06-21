CREATE TABLE rubrica_global_criterio (
    id_rubrica_global_criterio SERIAL PRIMARY KEY,

    id_rubrica_global INT NOT NULL,
    id_criterio INT NOT NULL,

    porcentaje NUMERIC(5,2) NOT NULL,

    CONSTRAINT fk_global_criterio_rubrica_global
        FOREIGN KEY (id_rubrica_global)
        REFERENCES rubrica_global(id_rubrica_global),

    CONSTRAINT fk_global_criterio_criterio
        FOREIGN KEY (id_criterio)
        REFERENCES criterio(id_criterio),

    CONSTRAINT chk_global_criterio_porcentaje
        CHECK (porcentaje BETWEEN 0 AND 100),

    CONSTRAINT uq_rubrica_global_criterio
        UNIQUE (id_rubrica_global, id_criterio)
);