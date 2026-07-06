ALTER TABLE evaluacion
ENABLE ROW LEVEL SECURITY;

ALTER TABLE detalle_evaluacion
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura evaluaciones autenticados"
ON evaluacion
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Lectura detalle evaluaciones autenticados"
ON detalle_evaluacion
FOR SELECT
TO authenticated
USING (true);