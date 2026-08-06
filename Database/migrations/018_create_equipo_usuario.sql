-- Sprint 4 - Relación equipo usuario

CREATE TABLE equipo_usuario (
    id_equipo INT NOT NULL,
    id_usuario INT NOT NULL,

    es_lider BOOLEAN DEFAULT FALSE,
    fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id_equipo, id_usuario),

    CONSTRAINT fk_equipo_usuario_equipo
        FOREIGN KEY (id_equipo)
        REFERENCES equipo(id_equipo),

    CONSTRAINT fk_equipo_usuario_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
);