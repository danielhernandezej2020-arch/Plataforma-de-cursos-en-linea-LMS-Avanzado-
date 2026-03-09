# EduPattern LMS - Plataforma Educativa Avanzada

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E)](https://developer.mozilla.org/es/docs/Web/JavaScript)

**EduPattern LMS** es una plataforma moderna de gestión de aprendizaje (LMS) desarrollada con el propósito principal de **demostrar e implementar patrones de diseño de software** estudiados en clase de manera práctica, limpia y mantenible.

Aunque se trata de una aplicación funcional completa, **el foco educativo del proyecto está puesto en la aplicación correcta y justificada de patrones de diseño** tales como:

- Singleton  
- Factory Method  
- Abstract Factory  
- (y los que se irán incorporando progresivamente: Builder, Strategy, Observer, Decorator, Command, etc.)

## Características principales del sistema (funcionalidad deseada)

- Gestión completa de cursos, módulos, lecciones y contenido multimedia
- Creación y gestión de evaluaciones (quizzes, exámenes, tareas)
- Sistema de certificaciones automáticas con plantillas personalizables
- Videoconferencias integradas con grabación automática de clases
- Motor de **aprendizaje adaptativo** con recomendaciones personalizadas de contenido
- Sistema de cursos gratuitos vs. premium con integración de pasarela de pagos
- Progreso del estudiante, estadísticas y reportes básicos
- Roles diferenciados: Admin, Instructor, Estudiante

## Tecnologías principales

- Lenguaje principal: **TypeScript** + JavaScript (ESNext)
- Entorno frontend: (Css → por definir)
- Entorno backend: (TypeScript/Java Script → por definir)
- Estilo: Tailwind CSS / CSS Modules / styled-components 
- Estado global: (Zustand / Redux Toolkit / Context API + patrones → por definir)
- Tipado fuerte y contratos claros mediante **interfaces** y **tipos avanzados**
- Arquitectura modular y fuertemente influenciada por patrones de diseño

> **Importante:** La elección concreta de frameworks y librerías puede cambiar durante el desarrollo. Lo que **no cambia** es el compromiso con aplicar y justificar los patrones de diseño de forma explícita.

## Objetivo principal del proyecto

Este repositorio **NO busca ser únicamente una plataforma LMS funcional**, sino servir como **laboratorio vivo y documentado** para:

- Implementar correctamente patrones de diseño clásicos del libro **"Design Patterns" (GoF)**
- Justificar la elección de cada patrón en el contexto concreto del dominio
- Mostrar cómo los patrones resuelven problemas reales de extensibilidad, mantenimiento y flexibilidad
- Comparar implementaciones antes y después de aplicar un patrón
- Crear código que sea fácilmente extensible para incorporar nuevos patrones

## Patrones ya implementados / en progreso

| Patrón              | Ubicación principal                        | Caso de uso principal                              | Estado     |
|---------------------|--------------------------------------------|-----------------------------------------------------|------------|
| Singleton           | Gestor de configuración / Conexión BD      | Única instancia de configuración global            | ✓ Implementado |
| Factory Method      | Creación de diferentes tipos de Evaluación | Crear Quiz, Examen, Tarea sin acoplar clases       | ✓ Implementado |
| Abstract Factory    | Familias de componentes UI por tema/marca  | Crear sets de componentes (light/dark, institucional) | ✓ Implementado |
| …                   | …                                          | …                                                   | Próximamente |

# EduPattern LMS

Plataforma educativa en línea (LMS) desarrollada con el propósito principal de **demostrar e implementar patrones de diseño de software** de forma práctica y documentada.

**Objetivo principal del proyecto**  
Aplicar y justificar los patrones de diseño vistos en clase (Singleton, Factory Method, Abstract Factory, y los que se vayan incorporando) en un contexto realista de aplicación educativa.

## Características principales (funcionalidad deseada)

- Gestión de cursos, módulos, lecciones y contenido
- Creación y calificación de evaluaciones (quizzes, exámenes, tareas)
- Sistema de certificaciones automáticas
- Videoconferencias integradas con grabación automática
- Recomendaciones personalizadas y aprendizaje adaptativo
- Diferenciación entre cursos gratuitos y premium (integración de pagos)
- Roles: Administrador, Instructor, Estudiante
- Seguimiento de progreso y estadísticas básicas

## Tecnologías principales (hasta el momento)

- **TypeScript** + JavaScript moderno
- **Next.js** (App Router)
- **Prisma** + base de datos relacional
- Tailwind CSS + PostCSS
- Entorno fuertemente tipado con interfaces y tipos avanzados

> Nota: las tecnologías concretas del frontend y backend pueden ajustarse con el tiempo, pero el enfoque en **patrones de diseño** y código mantenible/extensible permanece como prioridad.

## Estructura de carpetas (orientativa – estado actual)

```text
project-root/
├── prisma/                        # Configuración y modelos de base de datos
│   ├── migrations/                # Migraciones generadas por Prisma
│   │   └── 20260301..._init/      # ejemplo
│   ├── schema.prisma              # Entidades principales del dominio
│   └── seed.ts                    # Datos iniciales de prueba
│
├── public/                        # Recursos estáticos
│   ├── course-factory.jpeg        # Diagrama Factory Method - Cursos
│   ├── evaluation-factory.jpeg    # Diagrama Factory - Evaluaciones
│   ├── payment-provider.jpeg      # Diagrama relacionado con pagos
│   └── video-conference.jpeg      # Diagrama videoconferencia
│
├── src/                           # Código fuente de la aplicación
│   └── (próximamente contendrá:)
│       ├── app/                   # Rutas y páginas (Next.js App Router)
│       ├── components/            # Componentes reutilizables
│       ├── lib/                   # Utilidades y configuración
│       ├── domain/                # Entidades y reglas de negocio puras
│       ├── application/           # Casos de uso / lógica de aplicación
│       ├── infrastructure/        # Implementaciones concretas (DB, APIs externas)
│       └── shared/
│           └── patterns/          # ← Patrones de diseño (la parte central del aprendizaje)
│
├── .gitignore
├── README.md                      # ← este archivo
├── docker-compose.yml             # (opcional)
├── next.config.js
├── next-env.d.ts
├── package.json
├── package-lock.json              # o pnpm-lock.yaml / yarn.lock
├── postcss.config.js
└── tsconfig.json
