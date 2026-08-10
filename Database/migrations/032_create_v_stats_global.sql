CREATE OR REPLACE VIEW v_stats_global AS
SELECT
    p.id_parcial,
    p.nombre AS parcial,
    p.numero AS numero_parcial,

    COUNT(DISTINCT e.id_evaluacion) AS total_evaluaciones,

    ROUND(
        AVG(e.calificacion_total),
        2
    ) AS promedio_global,

    ROUND(
        MIN(e.calificacion_total),
        2
    ) AS calificacion_minima,

    ROUND(
        MAX(e.calificacion_total),
        2
    ) AS calificacion_maxima,

    COUNT(
        CASE
            WHEN e.calificacion_total >= 70
            THEN 1
        END
    ) AS evaluaciones_aprobadas,

    COUNT(
        CASE
            WHEN e.calificacion_total < 70
            THEN 1
        END
    ) AS evaluaciones_reprobadas

FROM evaluacion e

INNER JOIN parcial p
    ON p.id_parcial = e.id_parcial

WHERE e.estado = 'finalizada'

GROUP BY
    p.id_parcial,
    p.nombre,
    p.numero;