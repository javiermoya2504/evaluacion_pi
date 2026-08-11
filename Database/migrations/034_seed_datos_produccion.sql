```sql
-- ============================================================
-- 034_seed_datos_produccion.sql
-- Sprint 11 - Datos de prueba / producción
-- ============================================================

BEGIN;

-- ============================================================
-- 1. DATOS BASE
-- ============================================================

-- Carrera
INSERT INTO carrera (nombre, siglas)
VALUES
    ('Ingeniería en Sistemas Computacionales', 'ISC'),
    ('Ingeniería en Tecnologías de Manufactura', 'ITM')
RETURNING id_carrera;

-- Materias
INSERT INTO materia (nombre, clave, activo)
VALUES
    ('Bases de Datos', 'BD-01', TRUE),
    ('Redes de Computadoras', 'RED-01', TRUE),
    ('Ingeniería de Software', 'IS-01', TRUE);

-- Competencias
INSERT INTO competencia (nombre, descripcion)
VALUES
    (
        'Diseño de Bases de Datos',
        'Capacidad para diseñar estructuras de bases de datos relacionales.'
    ),
    (
        'Administración de Sistemas',
        'Capacidad para administrar sistemas y recursos tecnológicos.'
    ),
    (
        'Desarrollo de Software',
        'Capacidad para analizar, diseñar y desarrollar soluciones de software.'
    ),
    (
        'Trabajo en Equipo',
        'Capacidad para colaborar en equipos de trabajo para alcanzar objetivos.'
    );

-- ============================================================
-- 2. USUARIOS
-- ============================================================

-- Se utilizan los roles existentes.
-- El primer rol se utiliza como docente y el segundo como alumno.
-- No se modifican ni eliminan los 5 roles existentes.

DO $$
DECLARE
    v_rol_docente INT;
    v_rol_alumno INT;
    v_carrera_isc INT;
BEGIN

    SELECT id_rol
    INTO v_rol_docente
    FROM rol
    ORDER BY id_rol
    LIMIT 1;

    SELECT id_rol
    INTO v_rol_alumno
    FROM rol
    ORDER BY id_rol
    OFFSET 1
    LIMIT 1;

    SELECT id_carrera
    INTO v_carrera_isc
    FROM carrera
    WHERE siglas = 'ISC'
    LIMIT 1;

    INSERT INTO usuario
    (
        id_rol,
        id_carrera,
        matricula,
        nombre,
        correo,
        password_hash,
        activo
    )
    VALUES
    (
        v_rol_docente,
        v_carrera_isc,
        'DOC001',
        'Docente de Prueba',
        'docente@upq.edu.mx',
        '$2b$12$VPzQJYz4dF8NVSi7/hzLKubYFXPCYore0PK4YUVQ6fZf2L06QB/Zu',
        TRUE
    ),
    (
        v_rol_alumno,
        v_carrera_isc,
        '20260001',
        'Oscar Ramirez',
        'oscar.ramirez@upq.edu.mx',
        '$2b$12$VPzQJYz4dF8NVSi7/hzLKubYFXPCYore0PK4YUVQ6fZf2L06QB/Zu',
        TRUE
    ),
    (
        v_rol_alumno,
        v_carrera_isc,
        '20260002',
        'Carlos Hernandez',
        'carlos.hernandez@upq.edu.mx',
        '$2b$12$VPzQJYz4dF8NVSi7/hzLKubYFXPCYore0PK4YUVQ6fZf2L06QB/Zu',
        TRUE
    ),
    (
        v_rol_alumno,
        v_carrera_isc,
        '20260003',
        'Erick Martinez',
        'erick.martinez@upq.edu.mx',
        '$2b$12$VPzQJYz4dF8NVSi7/hzLKubYFXPCYore0PK4YUVQ6fZf2L06QB/Zu',
        TRUE
    );

END $$;

-- ============================================================
-- 3. DOCENTE - MATERIAS
-- ============================================================

INSERT INTO docente_materia (id_usuario, id_materia)
SELECT
    u.id_usuario,
    m.id_materia
FROM usuario u
CROSS JOIN materia m
WHERE u.correo = 'docente@upq.edu.mx';

-- ============================================================
-- 4. RÚBRICAS POR MATERIA
-- ============================================================

INSERT INTO rubrica_materia
(
    id_materia,
    nombre,
    porcentaje_total
)
SELECT
    id_materia,
    'Rúbrica de evaluación - ' || nombre,
    100
FROM materia;

-- ============================================================
-- 5. CRITERIOS
-- ============================================================

INSERT INTO criterio
(
    id_rubrica_materia,
    id_competencia,
    id_parcial,
    descripcion,
    porcentaje
)
SELECT
    rm.id_rubrica_materia,
    c.id_competencia,
    p.id_parcial,
    CASE
        WHEN c.nombre = 'Diseño de Bases de Datos'
            THEN 'Diseño y estructura de la solución'
        WHEN c.nombre = 'Administración de Sistemas'
            THEN 'Administración y configuración'
        WHEN c.nombre = 'Desarrollo de Software'
            THEN 'Implementación de la solución'
        ELSE 'Trabajo colaborativo'
    END,
    25
FROM rubrica_materia rm
CROSS JOIN competencia c
CROSS JOIN parcial p
WHERE p.numero = 1
LIMIT 12;

-- ============================================================
-- 6. RÚBRICA GLOBAL
-- ============================================================

INSERT INTO rubrica_global
(
    nombre,
    descripcion,
    id_parcial,
    id_usuario_creador,
    activo
)
SELECT
    'Rúbrica Global - Parcial ' || p.numero,
    'Rúbrica global para evaluación académica del parcial ' || p.numero,
    p.id_parcial,
    u.id_usuario,
    TRUE
FROM parcial p
CROSS JOIN usuario u
WHERE p.numero IN (1, 2, 3)
  AND u.correo = 'docente@upq.edu.mx';

-- ============================================================
-- 7. CRITERIOS DE RÚBRICA GLOBAL
-- ============================================================

INSERT INTO rubrica_global_criterio
(
    id_rubrica_global,
    id_criterio,
    porcentaje
)
SELECT
    rg.id_rubrica_global,
    c.id_criterio,
    25
FROM rubrica_global rg
JOIN parcial p
    ON p.id_parcial = rg.id_parcial
JOIN criterio c
    ON c.id_parcial = p.id_parcial
WHERE p.numero = 1
LIMIT 4;

-- ============================================================
-- 8. PROYECTOS
-- ============================================================

INSERT INTO proyecto
(
    id_carrera,
    nombre,
    descripcion,
    periodo,
    fecha_inicio,
    fecha_fin,
    estado,
    progreso
)
SELECT
    c.id_carrera,
    'Sistema de Evaluación Académica',
    'Proyecto de desarrollo de un sistema para administrar evaluaciones y rúbricas.',
    '2026-2',
    '2026-08-01',
    '2026-12-15',
    'activo',
    65
FROM carrera c
WHERE c.siglas = 'ISC';

-- ============================================================
-- 9. EQUIPOS
-- ============================================================

INSERT INTO equipo
(
    id_proyecto,
    nombre_equipo,
    fecha_creacion,
    estado
)
SELECT
    p.id_proyecto,
    'Equipo Alpha',
    CURRENT_TIMESTAMP,
    'activo'
FROM proyecto p
WHERE p.nombre = 'Sistema de Evaluación Académica';

INSERT INTO equipo
(
    id_proyecto,
    nombre_equipo,
    fecha_creacion,
    estado
)
SELECT
    p.id_proyecto,
    'Equipo Beta',
    CURRENT_TIMESTAMP,
    'activo'
FROM proyecto p
WHERE p.nombre = 'Sistema de Evaluación Académica';

-- ============================================================
-- 10. INTEGRANTES DE EQUIPOS
-- ============================================================

INSERT INTO equipo_usuario
(
    id_equipo,
    id_usuario,
    es_lider,
    fecha_union
)
SELECT
    e.id_equipo,
    u.id_usuario,
    CASE
        WHEN u.matricula = '20260001' THEN TRUE
        ELSE FALSE
    END,
    CURRENT_TIMESTAMP
FROM equipo e
CROSS JOIN usuario u
WHERE e.nombre_equipo = 'Equipo Alpha'
  AND u.matricula IN ('20260001', '20260002');

INSERT INTO equipo_usuario
(
    id_equipo,
    id_usuario,
    es_lider,
    fecha_union
)
SELECT
    e.id_equipo,
    u.id_usuario,
    TRUE,
    CURRENT_TIMESTAMP
FROM equipo e
JOIN usuario u
    ON u.matricula = '20260003'
WHERE e.nombre_equipo = 'Equipo Beta';

-- ============================================================
-- 11. EVALUACIONES
-- ============================================================

INSERT INTO evaluacion
(
    id_equipo,
    id_docente,
    id_rubrica_global,
    id_parcial,
    fecha_evaluacion,
    estado,
    calificacion_total
)
SELECT
    e.id_equipo,
    u.id_usuario,
    rg.id_rubrica_global,
    p.id_parcial,
    CURRENT_TIMESTAMP,
    'finalizada',
    0
FROM equipo e
CROSS JOIN usuario u
JOIN rubrica_global rg
    ON rg.id_parcial = (
        SELECT id_parcial
        FROM parcial
        WHERE numero = 1
        LIMIT 1
    )
JOIN parcial p
    ON p.id_parcial = rg.id_parcial
WHERE u.correo = 'docente@upq.edu.mx';

-- ============================================================
-- 12. DETALLES DE EVALUACIÓN
-- ============================================================

INSERT INTO detalle_evaluacion
(
    id_evaluacion,
    id_criterio,
    calificacion,
    observacion
)
SELECT
    e.id_evaluacion,
    c.id_criterio,
    CASE
        WHEN c.id_criterio % 4 = 0 THEN 90
        WHEN c.id_criterio % 3 = 0 THEN 85
        WHEN c.id_criterio % 2 = 0 THEN 95
        ELSE 88
    END,
    'Buen desempeño durante la evaluación.'
FROM evaluacion e
CROSS JOIN criterio c
JOIN parcial p
    ON p.id_parcial = c.id_parcial
WHERE p.numero = 1;

-- ============================================================
-- 13. RETROALIMENTACIÓN
-- ============================================================

INSERT INTO retroalimentacion
(
    id_evaluacion,
    id_equipo,
    id_docente,
    comentario,
    fecha_creacion,
    fecha_actualizacion,
    activo
)
SELECT
    e.id_evaluacion,
    e.id_equipo,
    e.id_docente,
    'El equipo presentó un buen desempeño general. Se recomienda mejorar la documentación y fortalecer la justificación técnica.',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    TRUE
FROM evaluacion e;

-- ============================================================
-- 14. EMAIL LOG
-- ============================================================

INSERT INTO email_log
(
    destinatario,
    asunto,
    estado,
    ts
)
VALUES
(
    'docente@upq.edu.mx',
    'Evaluación académica creada',
    'enviado',
    CURRENT_TIMESTAMP
),
(
    'oscar.ramirez@upq.edu.mx',
    'Evaluación finalizada',
    'enviado',
    CURRENT_TIMESTAMP
),
(
    'carlos.hernandez@upq.edu.mx',
    'Retroalimentación disponible',
    'enviado',
    CURRENT_TIMESTAMP
);

-- ============================================================
-- 15. AUDIT LOG
-- ============================================================

INSERT INTO audit_log
(
    id_usuario,
    tabla,
    accion,
    registro_id,
    datos_anteriores,
    datos_nuevos,
    fecha
)
SELECT
    u.id_usuario,
    'evaluacion',
    'INSERT',
    e.id_evaluacion,
    NULL,
    jsonb_build_object(
        'estado', e.estado,
        'calificacion_total', e.calificacion_total
    ),
    CURRENT_TIMESTAMP
FROM evaluacion e
JOIN usuario u
    ON u.id_usuario = e.id_docente;

-- ============================================================
-- FINAL
-- ============================================================

COMMIT;
```
