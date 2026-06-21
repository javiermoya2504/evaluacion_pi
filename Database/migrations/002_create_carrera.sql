CREATE TABLE carrera (
    id_carrera SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    siglas VARCHAR(20) UNIQUE
);