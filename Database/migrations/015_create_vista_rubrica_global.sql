CREATE VIEW v_rubrica_global_consolidado AS
SELECT
    rg.id_rubrica_global,
    rg.nombre AS rubrica_global,
    rg.descripcion,
    p.nombre AS parcial,
    c.id_criterio,
    c.descripcion AS criterio,
    rgc.porcentaje,
    comp.nombre AS competencia,
    rm.nombre AS rubrica_materia,
    m.nombre AS materia
FROM rubrica_global rg
INNER JOIN parcial p
    ON rg.id_parcial = p.id_parcial
INNER JOIN rubrica_global_criterio rgc
    ON rg.id_rubrica_global = rgc.id_rubrica_global
INNER JOIN criterio c
    ON rgc.id_criterio = c.id_criterio
INNER JOIN competencia comp
    ON c.id_competencia = comp.id_competencia
INNER JOIN rubrica_materia rm
    ON c.id_rubrica_materia = rm.id_rubrica_materia
INNER JOIN materia m
    ON rm.id_materia = m.id_materia;