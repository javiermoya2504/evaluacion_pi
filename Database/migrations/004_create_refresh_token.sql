CREATE TABLE refresh_token (
    id_token SERIAL PRIMARY KEY,

    id_usuario INT NOT NULL,

    token TEXT NOT NULL,

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    fecha_expiracion TIMESTAMP NOT NULL,

    CONSTRAINT fk_refresh_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);