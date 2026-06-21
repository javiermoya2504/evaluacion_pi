CREATE TABLE materia (
    id_materia SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    clave VARCHAR(20) UNIQUE,
    activo BOOLEAN DEFAULT TRUE
);