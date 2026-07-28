CREATE TABLE audit_log (

    id_audit SERIAL PRIMARY KEY,

    id_usuario INT,

    tabla VARCHAR(100) NOT NULL,

    accion VARCHAR(20) NOT NULL,

    registro_id INT,

    datos_anteriores JSONB,

    datos_nuevos JSONB,

    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario),

    CONSTRAINT chk_accion
        CHECK (accion IN ('INSERT','UPDATE','DELETE'))
);