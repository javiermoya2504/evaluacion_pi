CREATE TABLE rol (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

INSERT INTO rol(nombre, descripcion)
VALUES
('Administrador','Control total'),
('Profesor','Docente evaluador'),
('Jefe Academia','Gestión académica'),
('Coordinador PI','Gestión proyectos integradores'),
('Alumno','Participante');