
CREATE TABLE rubrica_global (
    id_rubrica_global SERIAL PRIMARY KEY,

    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,

    id_parcial INT NOT NULL,
    id_usuario_creador INT NOT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_rubrica_global_parcial
        FOREIGN KEY (id_parcial)
        REFERENCES parcial(id_parcial),

    CONSTRAINT fk_rubrica_global_usuario
        FOREIGN KEY (id_usuario_creador)
        REFERENCES usuario(id_usuario)
);