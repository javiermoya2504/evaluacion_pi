CREATE OR REPLACE FUNCTION actualizar_fecha_retroalimentacion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_actualizar_fecha_retroalimentacion
BEFORE UPDATE
ON retroalimentacion
FOR EACH ROW
EXECUTE FUNCTION actualizar_fecha_retroalimentacion();

ALTER TABLE retroalimentacion
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura retroalimentacion autenticados"
ON retroalimentacion
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Insertar retroalimentacion autenticados"
ON retroalimentacion
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Actualizar retroalimentacion autenticados"
ON retroalimentacion
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);