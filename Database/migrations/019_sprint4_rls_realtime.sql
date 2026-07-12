-- Sprint 4 - RLS y Realtime

ALTER TABLE proyecto ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipo ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipo_usuario ENABLE ROW LEVEL SECURITY;

-- Política temporal de lectura para usuarios autenticados
-- Más adelante se puede hacer más estricta por rol.
CREATE POLICY "Lectura proyecto autenticados"
ON proyecto
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Lectura equipo autenticados"
ON equipo
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Lectura equipo_usuario autenticados"
ON equipo_usuario
FOR SELECT
TO authenticated
USING (true);

-- Activar Realtime para la tabla equipo
ALTER PUBLICATION supabase_realtime ADD TABLE equipo;