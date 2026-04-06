# EduPattern LMS - Plataforma Educativa Avanzada

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ESNext-F7DF1E)](https://developer.mozilla.org/es/docs/Web/JavaScript)

**EduPattern LMS** es una plataforma moderna de gestión de aprendizaje (LMS) desarrollada con el propósito principal de **demostrar e implementar patrones de diseño de software** estudiados en clase de manera práctica, limpia y mantenible.

## El documento de las evidencias se encuentra tanto dentro del repositorio como anexado en el siguiente link:  [Evidencia - Patrones Aplicados](https://github.com/danielhernandezej2020-arch/Evidencia-Patrones-aplicados-DanielBoh-rquez_DanielHern-ndez/tree/main)



Aunque se trata de una aplicación funcional completa, **el foco educativo del proyecto está puesto en la aplicación correcta y justificada de patrones de diseño** tales como:

- Singleton
- Factory Method
- Abstract Factory
- Builder
- Adapter
- (y los que se irán incorporando progresivamente: Strategy, Observer, Decorator, Command, etc.)

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


## Patrones ya implementados / en progreso

| Patrón              | Ubicación principal                        | Caso de uso principal                              | Estado     |
|---------------------|--------------------------------------------|-----------------------------------------------------|------------|
| Singleton           | Gestor de configuración / Conexión BD      | Única instancia de configuración global            | ✓ Implementado |
| Factory Method      | Creación de diferentes tipos de Evaluación | Crear Quiz, Examen, Tarea sin acoplar clases       | ✓ Implementado |
| Abstract Factory    | Familias de componentes UI por tema/marca  | Crear sets de componentes (light/dark, institucional) | ✓ Implementado |
| Builder             | `src/domain/builders/` (Course, Evaluation, Certificate) | Ensamblar entidades complejas paso a paso con API fluida | ✓ Implementado |
| Adapter             | `src/infrastructure/payments/` (StripePaymentAdapter, PayPalPaymentAdapter) | Adaptar SDKs externos incompatibles a IPaymentProvider | ✓ Implementado |
| …                   | …                                          | …                                                   | Próximamente |


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
│       │   └── builders/          # ← CourseBuilder, EvaluationBuilder, CertificateBuilder
│       ├── application/           # Casos de uso / lógica de aplicación
│       ├── infrastructure/        # Implementaciones concretas (DB, APIs externas)
│       │   └── factories/         # Factories (actúan como Directores de los builders)
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
```

---

## Patrón Adapter — Integración de pasarelas de pago externas

### El problema

Los SDKs de Stripe y PayPal tienen APIs completamente distintas entre sí y además incompatibles con la interfaz `IPaymentProvider` que define nuestro dominio. No podemos modificar esos SDKs (son librerías externas). El resto del sistema solo conoce `IPaymentProvider` y no debe saber nada de la implementación concreta de cada pasarela.

| Aspecto         | `IPaymentProvider` (Target)       | `StripeSDK` (Adaptee)                  | `PayPalSDK` (Adaptee)                        |
|-----------------|-----------------------------------|----------------------------------------|----------------------------------------------|
| Método de cobro | `processPayment(amount, userId, metadata)` | `charge(amountInCents, customerId, description)` | `executePayment(totalAmount, currency, payerId, note)` |
| Tipo del monto  | `number` (dólares)                | `number` (centavos — entero)           | `string` (`"19.99"`)                         |
| Respuesta       | `PaymentResult`                   | `{ id, amount, status, customer, … }`  | `{ purchase_units[], payer, transaction_id, state }` |
| Reembolso       | `refund(transactionId)`           | `refundCharge(chargeId)`               | `refundTransaction(transactionId)`           |
| Estado exitoso  | `success: true`                   | `status === "succeeded"`               | `state === "approved"`                       |

### Diagrama

```
                 ┌─────────────────────────────────────────────┐
                 │               «interface»                   │
                 │            IPaymentProvider                 │  ← Target
                 │  + processPayment(amount, userId, metadata) │
                 │  + refund(transactionId)                    │
                 └──────────────────┬──────────────────────────┘
                                    │ implements
              ┌─────────────────────┴──────────────────────┐
              │                                            │
 ┌────────────▼──────────────┐             ┌──────────────▼──────────────┐
 │   StripePaymentAdapter    │             │   PayPalPaymentAdapter      │  ← Adapters
 │  - stripeSDK: StripeSDK   │             │  - paypalSDK: PayPalSDK     │
 │  + processPayment(…)      │             │  + processPayment(…)        │
 │  + refund(…)              │             │  + refund(…)                │
 └────────────┬──────────────┘             └──────────────┬──────────────┘
              │ usa (composición)                          │ usa (composición)
 ┌────────────▼──────────────┐             ┌──────────────▼──────────────┐
 │        StripeSDK          │             │          PayPalSDK          │  ← Adaptees
 │  + charge(cents, …)       │             │  + executePayment(str, …)   │
 │  + refundCharge(id)       │             │  + refundTransaction(id)    │
 └───────────────────────────┘             └─────────────────────────────┘

          ▲
          │ crea mediante
 ┌────────┴──────────────────┐
 │  PaymentProviderFactory   │  ← Cliente
 │  create("stripe"|"paypal")|
 └───────────────────────────┘
```

### Fragmentos de código

**Target** — la interfaz que el dominio conoce (`src/domain/services/IPaymentProvider.ts`):
```typescript
export interface IPaymentProvider {
  readonly name: string;
  processPayment(amount: number, userId: string, metadata: Record<string, string>): Promise<PaymentResult>;
  refund(transactionId: string): Promise<{ success: boolean }>;
}
```

**Adaptee** — SDK externo con API incompatible (`src/infrastructure/payments/external/StripeSDK.ts`):
```typescript
// EXTERNAL SDK — no se puede modificar
export class StripeSDK {
  async charge(amountInCents: number, customerId: string, description: string): Promise<StripeChargeResponse> { … }
  async refundCharge(chargeId: string): Promise<StripeRefundResponse> { … }
}
```

**Adapter** — envuelve el Adaptee y traduce su API al Target (`src/infrastructure/payments/StripePaymentAdapter.ts`):
```typescript
export class StripePaymentAdapter implements IPaymentProvider {
  constructor(private readonly stripeSDK: StripeSDK) {}

  async processPayment(amount: number, userId: string, metadata: Record<string, string>): Promise<PaymentResult> {
    const amountInCents = Math.round(amount * 100);          // dólares → centavos
    const response = await this.stripeSDK.charge(amountInCents, userId, metadata.description ?? "");
    return {
      success: response.status === "succeeded",              // string → boolean
      transactionId: response.id,
      provider: this.name,
      amount: response.amount / 100,                         // centavos → dólares
    };
  }
}
```

**Cliente** — únicamente conoce la interfaz Target (`src/infrastructure/factories/PaymentProviderFactory.ts`):
```typescript
case "stripe":  return new StripePaymentAdapter(new StripeSDK());
case "paypal":  return new PayPalPaymentAdapter(new PayPalSDK());
```

### Composición sobre herencia

El Adapter utiliza **composición** (recibe el SDK por constructor) en lugar de herencia (`extends StripeSDK`). Esto evita:

- Acoplarnos a los detalles internos del SDK que no controlamos.
- Romper el principio de sustitución de Liskov si el SDK añade métodos.
- Dificultades para hacer pruebas unitarias (podemos inyectar un SDK falso).

La composición nos permite intercambiar o versionar el SDK sin tocar la interfaz que expone el Adapter.
