CREATE TABLE usuario (
    id_usuario SERIAL PRIMARY KEY,

    id_rol INT NOT NULL,
    id_carrera INT,

    matricula VARCHAR(20),

    nombre VARCHAR(100) NOT NULL,

    correo VARCHAR(120) UNIQUE NOT NULL,

    password_hash TEXT NOT NULL,

    activo BOOLEAN DEFAULT TRUE,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol(id_rol),

    CONSTRAINT fk_usuario_carrera
        FOREIGN KEY (id_carrera)
        REFERENCES carrera(id_carrera)
);