CREATE OR REPLACE VIEW calificaciones_finales_consolidadas AS
SELECT
    e.id_evaluacion,
    e.id_equipo,
    e.id_docente,
    e.id_parcial,
    e.fecha_evaluacion,
    e.estado,
    e.calificacion_total
FROM evaluacion e;