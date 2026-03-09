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
- Entorno frontend: (React / Next.js / Vite + React / Angular / Vue → por definir)
- Entorno backend: (Node.js + Express / NestJS / Fastify → por definir)
- Estilo: Tailwind CSS / CSS Modules / styled-components (por definir)
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

## Estructura de carpetas (orientativa)

project-root/
├── prisma/                        # Configuración de base de datos con Prisma
│   ├── migrations/                # Migraciones generadas automáticamente
│   │   └── 20260301154343_init/   # (ejemplo de carpeta de migración)
│   ├── schema.prisma              # Modelo de datos principal
│   └── seed.ts                    # Datos de prueba / seed inicial
│
├── public/                        # Archivos estáticos servidos directamente
│   ├── course-factory.jpeg        # Diagrama Factory Method - Cursos
│   ├── evaluation-factory.jpeg    # Diagrama Factory - Evaluaciones
│   ├── payment-provider.jpeg      # Diagrama pago / Strategy o Factory
│   └── video-conference.jpeg      # Diagrama videoconferencia
│
├── src/                           # Código fuente principal
│   ├── (aquí irán los módulos del proyecto...)
│   └── ...
│
├── .gitignore
├── README.md                      ← este archivo
├── docker-compose.yml             # ( contenedores)
├── next-env.d.ts
├── next.config.js                 # Configuración de Next.js
├── package.json
├── package-lock.json              # o pnpm-lock.yaml / yarn.lock
├── postcss.config.js
└── tsconfig.json
