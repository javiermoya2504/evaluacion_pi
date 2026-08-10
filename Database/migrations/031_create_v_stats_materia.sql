CREATE OR REPLACE VIEW v_stats_materia AS
SELECT
    m.id_materia,
    m.nombre AS materia,
    p.id_parcial,
    p.nombre AS parcial,
    p.numero AS numero_parcial,

    COUNT(DISTINCT e.id_evaluacion) AS total_evaluaciones,

    ROUND(
        AVG(e.calificacion_total),
        2
    ) AS promedio_materia,

    ROUND(
        MIN(e.calificacion_total),
        2
    ) AS calificacion_minima,

    ROUND(
        MAX(e.calificacion_total),
        2
    ) AS calificacion_maxima

FROM materia m

INNER JOIN rubrica_materia rm
    ON rm.id_materia = m.id_materia

INNER JOIN criterio c
    ON c.id_rubrica_materia = rm.id_rubrica_materia

INNER JOIN detalle_evaluacion de
    ON de.id_criterio = c.id_criterio

INNER JOIN evaluacion e
    ON e.id_evaluacion = de.id_evaluacion

INNER JOIN parcial p
    ON p.id_parcial = e.id_parcial

WHERE e.estado = 'finalizada'

GROUP BY
    m.id_materia,
    m.nombre,
    p.id_parcial,
    p.nombre,
    p.numero;