CREATE OR REPLACE FUNCTION calcular_total_evaluacion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_evaluacion INT;
BEGIN
    v_id_evaluacion := COALESCE(
        NEW.id_evaluacion,
        OLD.id_evaluacion
    );

    UPDATE evaluacion
    SET calificacion_total = COALESCE(
        (
            SELECT SUM(
                de.calificacion * rgc.porcentaje / 100
            )
            FROM detalle_evaluacion de
            INNER JOIN evaluacion e
                ON de.id_evaluacion = e.id_evaluacion
            INNER JOIN rubrica_global_criterio rgc
                ON rgc.id_rubrica_global = e.id_rubrica_global
               AND rgc.id_criterio = de.id_criterio
            WHERE de.id_evaluacion = v_id_evaluacion
        ),
        0
    )
    WHERE id_evaluacion = v_id_evaluacion;

    RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER trg_calc_total_evaluacion
AFTER INSERT OR UPDATE OR DELETE
ON detalle_evaluacion
FOR EACH ROW
EXECUTE FUNCTION calcular_total_evaluacion();