CREATE TABLE parcial (
    id_parcial SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    numero INT UNIQUE NOT NULL,

    CONSTRAINT chk_numero_parcial
    CHECK (numero BETWEEN 1 AND 3)
);