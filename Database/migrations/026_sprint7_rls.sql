ALTER TABLE audit_log
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura audit autenticados"
ON audit_log
FOR SELECT
TO authenticated
USING (true);