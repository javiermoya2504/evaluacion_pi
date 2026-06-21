ALTER TABLE usuario
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura usuarios autenticados"
ON usuario
FOR SELECT
TO authenticated
USING (true);