-- Sprint 4 - Tabla proyecto

CREATE TABLE proyecto (
    id_proyecto SERIAL PRIMARY KEY,

    id_carrera INT NOT NULL,

    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    periodo VARCHAR(20),

    fecha_inicio DATE,
    fecha_fin DATE,

    estado VARCHAR(20) DEFAULT 'activo',
    progreso NUMERIC(5,2) DEFAULT 0,

    CONSTRAINT fk_proyecto_carrera
        FOREIGN KEY (id_carrera)
        REFERENCES carrera(id_carrera),

    CONSTRAINT chk_proyecto_progreso
        CHECK (progreso BETWEEN 0 AND 100)
);