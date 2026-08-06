-- Sprint 4 - Tabla equipo

CREATE TABLE equipo (
    id_equipo SERIAL PRIMARY KEY,

    id_proyecto INT NOT NULL,

    nombre_equipo VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo',

    CONSTRAINT fk_equipo_proyecto
        FOREIGN KEY (id_proyecto)
        REFERENCES proyecto(id_proyecto)
);