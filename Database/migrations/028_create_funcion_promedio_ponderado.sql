CREATE OR REPLACE FUNCTION promedio_ponderado_equipo(
    p_equipo INT
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_promedio NUMERIC(5,2);
BEGIN

    SELECT
        ROUND(
            SUM(de.calificacion * c.porcentaje)
            /
            NULLIF(SUM(c.porcentaje),0)
        ,2)
    INTO v_promedio
    FROM evaluacion e
    JOIN detalle_evaluacion de
        ON e.id_evaluacion = de.id_evaluacion
    JOIN criterio c
        ON de.id_criterio = c.id_criterio
    WHERE e.id_equipo = p_equipo;

    RETURN COALESCE(v_promedio,0);

END;
$$;