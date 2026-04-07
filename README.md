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
| Prototype           | `src/infrastructure/prototypes/` (EvaluationPrototype, CertificatePrototype) | Clonar evaluaciones y emitir certificados en lote     | ✓ Implementado |
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

---

## Patrón Prototype — Clonación de evaluaciones y certificados

### El problema

Crear una evaluación nueva para un curso distinto copiando la estructura de una existente (mismo banco de preguntas, misma puntuación de aprobación) requeriría construir el objeto desde cero usando el Factory/Builder, duplicando código de configuración. De igual forma, emitir el mismo certificado en lote para varios usuarios implicaría invocar el factory N veces con los mismos parámetros base. Ambos casos tienen en común que **el objeto origen ya existe y es costoso o tedioso reconstruir su estado**, por lo que es preferible clonarlo y aplicar solo los cambios necesarios.

| Aspecto               | Sin Prototype                                      | Con Prototype                                         |
|-----------------------|----------------------------------------------------|-------------------------------------------------------|
| Fuente de la copia    | Reconstrucción manual desde el DTO original        | `prototype.clone(overrides)` sobre el objeto real     |
| Deep copy de `questions` | El llamador debe conocer la estructura interna | Encapsulado dentro de `EvaluationPrototype`           |
| Emisión en lote       | N invocaciones al factory con parámetros repetidos | Un prototype, bucle de `clone({ userId })`            |
| Acoplamiento          | El servicio conoce los detalles de construcción    | El servicio solo conoce `IPrototype<T>`               |

### Diagrama

```
          «interface»
        ┌───────────────────────────────────┐
        │          IPrototype<T, O>         │
        │  + clone(overrides?: O): T        │
        └──────────────┬────────────────────┘
                       │ implements
          ┌────────────┴─────────────────┐
          │                              │
┌─────────▼──────────────┐   ┌──────────▼──────────────────┐
│  EvaluationPrototype   │   │    CertificatePrototype      │
│  - source: Evaluation  │   │    - source: Certificate     │
│  + clone(overrides?)   │   │    + clone(overrides?)       │
│    → deep copy         │   │      → new code + issuedAt   │
│      questions array   │   │      → shallow copy metadata │
└────────────────────────┘   └─────────────────────────────┘
          ▲                              ▲
          │ usa                          │ usa
┌─────────┴──────────────┐   ┌──────────┴──────────────────┐
│   EvaluationService    │   │     CertificateService       │
│  cloneEvaluation(id,   │   │  cloneCertificateTemplate(   │
│    dto)                │   │    templateId, userIds[])    │
└────────────────────────┘   └─────────────────────────────┘
          ▲
          │ POST /api/evaluations/:id/clone
┌─────────┴──────────────┐
│   clone/route.ts       │
└────────────────────────┘
```

### Fragmentos de código

**Contrato de dominio** (`src/domain/prototypes/IPrototype.ts`):
```typescript
export interface IPrototype<T, O extends Partial<T> = Partial<T>> {
  clone(overrides?: O): T;
}
```

**Prototype concreto para Evaluation** (`src/infrastructure/prototypes/EvaluationPrototype.ts`):
```typescript
export class EvaluationPrototype implements IPrototype<Evaluation, EvaluationOverrides> {
  constructor(private readonly source: Evaluation) {}

  clone(overrides?: EvaluationOverrides): Evaluation {
    // Deep copy: cada QuizQuestion y su array options son nuevos objetos
    const questions = Array.isArray(this.source.questions)
      ? (this.source.questions as QuizQuestion[]).map((q) => ({
          ...q,
          options: [...q.options],
        }))
      : this.source.questions;

    return {
      id: uuidv4(),          // nuevo id
      ...this.source,
      questions,             // deep copy
      createdAt: new Date(), // nuevo timestamp
      ...overrides,          // courseId, title, passingScore del llamador
    };
  }
}
```

**Uso en el servicio** (`src/application/services/EvaluationService.ts`):
```typescript
async cloneEvaluation(sourceId: string, dto: CloneEvaluationDTO): Promise<Evaluation> {
  const source = await this.evaluationRepository.findById(sourceId);
  if (!source) throw new Error("Source evaluation not found");
  // PROTOTYPE
  const prototype = new EvaluationPrototype(source);
  const cloned = prototype.clone({
    courseId: dto.courseId,
    title: dto.title ?? `${source.title} (copy)`,
    passingScore: dto.passingScore,
  });
  return this.evaluationRepository.save(cloned);
}
```

**Endpoint API** (`src/app/api/evaluations/[id]/clone/route.ts`):
```typescript
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const cloned = await evaluationService.cloneEvaluation(params.id, {
    courseId: body.courseId,
    title: body.title,
    passingScore: body.passingScore,
  });
  return NextResponse.json(cloned, { status: 201 });
}
```

### Prototype vs otras soluciones

El patrón **Prototype** se diferencia del **Factory Method** en que no reconstruye un objeto desde parámetros abstractos, sino que **parte del estado completo de una instancia ya existente**. Si usáramos el `EvaluationFactory` para clonar, necesitaríamos serializar todas las preguntas de vuelta a un DTO y luego pasarlo al factory, lo que rompe la encapsulación y duplica la lógica de transformación. El Prototype encapsula esa lógica de copia (incluyendo el deep copy del array anidado de preguntas) dentro del propio objeto origen. En el caso del certificado en lote, la ventaja es aún más clara: un único `CertificatePrototype` se reutiliza en un bucle para emitir N copias con distinto `userId`, `code` e `issuedAt` sin requerir ni el factory ni el builder en cada iteración.
