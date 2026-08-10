CREATE TABLE email_log (
    id_email_log SERIAL PRIMARY KEY,

    destinatario VARCHAR(255) NOT NULL,

    asunto VARCHAR(255) NOT NULL,

    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',

    ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_email_log_estado
        CHECK (estado IN ('pendiente', 'enviado', 'fallido'))
);