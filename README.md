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
| Decorator           | `src/infrastructure/payments/decorators/` (LoggingPaymentDecorator, RetryPaymentDecorator) | Añadir logging y reintentos a cualquier IPaymentProvider sin modificar los adaptadores | ✓ Implementado |
| Bridge              | `src/infrastructure/notifications/` + `src/domain/services/notifications/` | Desacoplar tipo de notificación del canal de entrega (Email, Console, SMS…) | ✓ Implementado |
| Composite           | `src/domain/composite/` + `src/infrastructure/notifications/channels/CompositeNotificationChannel.ts` | Tratar módulos y cursos de forma uniforme mediante un árbol; enviar a múltiples canales de notificación con un solo `send()` | ✓ Implementado |
| Facade              | `src/infrastructure/facades/` (LearningFacade, CourseManagementFacade) | Ocultar la complejidad del flujo de inscripción y de creación de cursos detrás de métodos simples | ✓ Implementado |
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

---

## Patrón Decorator — Comportamientos adicionales en pasarelas de pago

### El problema

Los adaptadores `StripePaymentAdapter` y `PayPalPaymentAdapter` procesan pagos correctamente, pero el sistema necesita comportamientos transversales como **registro de actividad (logging)** y **reintentos automáticos** ante fallos transitorios. Añadir esas capacidades directamente a cada adaptador violaría el Principio de Responsabilidad Única y obligaría a duplicar código. Crear subclases (`StripeLoggingAdapter`, `StripeRetryAdapter`, `StripeLoggingRetryAdapter`, etc.) genera una explosión de clases.

| Aspecto                | Sin Decorator                                      | Con Decorator                                        |
|------------------------|----------------------------------------------------|------------------------------------------------------|
| Añadir logging         | Modificar cada adaptador o crear subclases         | `new LoggingPaymentDecorator(adaptador)`             |
| Añadir retry           | Duplicar lógica en cada adaptador                  | `new RetryPaymentDecorator(adaptador, 3)`            |
| Combinar ambos         | Crear subclase combinada por cada adaptador        | `new LoggingPaymentDecorator(new RetryPaymentDecorator(adaptador, 3))` |
| Modificar adaptadores  | Sí — rompe OCP                                     | No — los adaptadores no cambian                      |
| Desactivar en pruebas  | Difícil — comportamiento acoplado                  | Fácil — no envolver el adaptador                     |

### Diagrama

```
              «interface»
         ┌──────────────────────────────────────┐
         │          IPaymentProvider            │  ← Component (Target)
         │  + processPayment(amount, …)         │
         │  + refund(transactionId)             │
         └──────────┬───────────────────────────┘
                    │ implements
     ┌──────────────┼──────────────────────────────────────┐
     │              │                                      │
┌────▼────────┐ ┌───▼──────────────────────┐  ┌───────────▼───────────────┐
│StripePayment│ │  PaymentProviderDecorator │  │   PayPalPaymentAdapter    │
│   Adapter   │ │  # wrapped: IPaymentProv.│  │   (ConcreteComponent)     │
│(Concrete    │ │  + processPayment(…)      │  └───────────────────────────┘
│ Component)  │ │  + refund(…)             │
└─────────────┘ └──────────┬───────────────┘
                            │ extiende
             ┌──────────────┴──────────────┐
             │                             │
┌────────────▼────────────┐  ┌─────────────▼───────────────┐
│  LoggingPaymentDecorator│  │   RetryPaymentDecorator      │  ← ConcreteDecorators
│  + processPayment(…)    │  │   - maxRetries: number       │
│    → log antes/después  │  │   + processPayment(…)        │
│  + refund(…)            │  │     → reintenta N veces      │
│    → log antes/después  │  └─────────────────────────────┘
└─────────────────────────┘

Uso en container/index.ts (apilamiento de decoradores):
  new LoggingPaymentDecorator(
    new RetryPaymentDecorator(stripeAdapter, 3)
  )
```

### Fragmentos de código

**Decorator Base** — delega todas las operaciones al componente envuelto (`src/infrastructure/payments/decorators/PaymentProviderDecorator.ts`):
```typescript
export abstract class PaymentProviderDecorator implements IPaymentProvider {
  constructor(protected readonly wrapped: IPaymentProvider) {}

  get name(): string { return this.wrapped.name; }

  async processPayment(amount: number, userId: string, metadata: Record<string, string>): Promise<PaymentResult> {
    return this.wrapped.processPayment(amount, userId, metadata);
  }

  async refund(transactionId: string): Promise<{ success: boolean }> {
    return this.wrapped.refund(transactionId);
  }
}
```

**ConcreteDecorator: Logging** (`src/infrastructure/payments/decorators/LoggingPaymentDecorator.ts`):
```typescript
export class LoggingPaymentDecorator extends PaymentProviderDecorator {
  async processPayment(amount: number, userId: string, metadata: Record<string, string>): Promise<PaymentResult> {
    console.log(`[Decorator:Logging][${this.name}] processPayment → amount=${amount}, userId=${userId}`);
    const result = await super.processPayment(amount, userId, metadata);
    console.log(`[Decorator:Logging][${this.name}] processPayment ← success=${result.success}, txId=${result.transactionId}`);
    return result;
  }
  // refund() con logging similar…
}
```

**ConcreteDecorator: Retry** (`src/infrastructure/payments/decorators/RetryPaymentDecorator.ts`):
```typescript
export class RetryPaymentDecorator extends PaymentProviderDecorator {
  constructor(wrapped: IPaymentProvider, private readonly maxRetries = 3, private readonly delayMs = 500) {
    super(wrapped);
  }

  async processPayment(amount: number, userId: string, metadata: Record<string, string>): Promise<PaymentResult> {
    let lastResult: PaymentResult | undefined;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const result = await super.processPayment(amount, userId, metadata);
        if (result.success) return result;        // éxito → retorna inmediatamente
        lastResult = result;
      } catch (err) {
        lastResult = { success: false, transactionId: "", provider: this.name, amount, error: String(err) };
      }
      if (attempt < this.maxRetries) await new Promise<void>((r) => setTimeout(r, this.delayMs * attempt));
    }
    return lastResult!;
  }
}
```

**Wiring en el contenedor** (`src/container/index.ts`):
```typescript
// Logging (capa externa) envuelve a Retry (capa interna) que envuelve al adaptador base
paymentRegistry.registerProvider(
  "stripe",
  new LoggingPaymentDecorator(
    new RetryPaymentDecorator(paymentProviderFactory.create("stripe"), 3)
  )
);
```

### Decorator vs herencia

El patrón **Decorator** usa **composición** en lugar de herencia para extender comportamiento. Con herencia habría que crear una subclase por cada combinación posible (`StripeLoggingAdapter`, `StripeRetryAdapter`, `StripeLoggingRetryAdapter`, `PayPalLoggingAdapter`…). Con Decorator, cada comportamiento es una capa independiente que puede apilarse sobre cualquier `IPaymentProvider` en el orden deseado, respetando el Principio Abierto/Cerrado: los adaptadores originales no se modifican.

---

## Patrón Bridge — Sistema de notificaciones del LMS

### El problema

El LMS necesita enviar notificaciones para distintos eventos (inscripción, pago confirmado, certificado emitido) a través de distintos canales (correo electrónico, consola/log, SMS, push…). Sin Bridge, cada combinación requeriría su propia clase: `EnrollmentEmailNotification`, `EnrollmentSMSNotification`, `PaymentEmailNotification`, etc. Con M tipos de evento y N canales, el resultado es M×N clases. El Bridge resuelve esto separando la jerarquía de **qué notificar** (Abstraction) de la jerarquía de **cómo entregarlo** (Implementor), reduciéndolo a M+N clases.

| Aspecto               | Sin Bridge (herencia)                             | Con Bridge (composición)                              |
|-----------------------|---------------------------------------------------|-------------------------------------------------------|
| Nuevos canales        | Añadir subclase por cada tipo de notificación     | Solo crear un nuevo `INotificationChannel`            |
| Nuevos tipos evento   | Añadir subclase por cada canal                    | Solo crear una nueva `Notification` subclase          |
| Clases totales        | M tipos × N canales = M×N                        | M tipos + N canales = M+N                            |
| Cambio de canal       | Requiere cambiar la jerarquía de abstracciones    | Se inyecta el canal en el constructor                 |
| Pruebas unitarias     | Difícil — tipo y canal acoplados                  | Fácil — se inyecta un canal mock                      |

### Diagrama

```
  ┌──────────────────────────────────┐       ┌────────────────────────────────┐
  │         «abstract»               │       │         «interface»             │
  │         Notification             │─────▶│       INotificationChannel     │  ← Implementor
  │  # channel: INotificationChannel│       │  + send(to, subject, body)     │
  │  + notify(recipient, data)       │       └──────────────┬─────────────────┘
  └──────────────┬───────────────────┘                      │ implementa
                 │ extiende                    ┌────────────┴────────────────┐
   ┌─────────────┼──────────────────┐         │                             │
   │             │                  │ ┌────────▼──────────────┐ ┌───────────▼────────────┐
┌──▼──────────┐ ┌▼─────────────┐ ┌─▼──────────┐ │ConsoleNotification│ │EmailNotification   │← ConcreteImplementors
│Enrollment   │ │Payment       │ │Certificate  │ │Channel            │ │Channel             │
│Notification │ │Notification  │ │Notification │ │+ send(…)          │ │+ send(…)           │
│             │ │              │ │             │ │  → console.log    │ │  → proveedor email │
│+ notify(…)  │ │+ notify(…)   │ │+ notify(…)  │ └───────────────────┘ └────────────────────┘
└─────────────┘ └──────────────┘ └─────────────┘
  ↑ RefinedAbstractions

Uso (combinaciones en tiempo de ejecución):
  new EnrollmentNotification(new EmailNotificationChannel())
  new PaymentNotification(new ConsoleNotificationChannel())
  new CertificateNotification(new EmailNotificationChannel())
```

### Fragmentos de código

**Implementor** — contrato del canal de entrega (`src/domain/services/notifications/INotificationChannel.ts`):
```typescript
export interface INotificationChannel {
  send(to: string, subject: string, body: string): Promise<void>;
}
```

**Abstraction** — base de la jerarquía de notificaciones (`src/domain/services/notifications/Notification.ts`):
```typescript
export abstract class Notification {
  constructor(protected readonly channel: INotificationChannel) {}
  abstract notify(recipient: string, data: Record<string, string>): Promise<void>;
}
```

**ConcreteImplementor** — entrega por consola (`src/infrastructure/notifications/channels/ConsoleNotificationChannel.ts`):
```typescript
export class ConsoleNotificationChannel implements INotificationChannel {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`[Notificación → Console] Para: ${to} | Asunto: "${subject}"`);
    console.log(`  Cuerpo: ${body}`);
  }
}
```

**RefinedAbstraction** — notificación de inscripción (`src/infrastructure/notifications/EnrollmentNotification.ts`):
```typescript
export class EnrollmentNotification extends Notification {
  async notify(recipient: string, data: Record<string, string>): Promise<void> {
    const subject = `¡Bienvenido al curso "${data.courseName}"!`;
    const body =
      `Hola ${data.studentName ?? recipient},\n\n` +
      `Te has inscrito exitosamente en el curso "${data.courseName}".\n` +
      `Instructor: ${data.instructorName ?? "No especificado"}\n\n` +
      `¡Mucho éxito en tu aprendizaje!`;
    await this.channel.send(recipient, subject, body);   // delega al canal
  }
}
```

**Uso combinado** — el canal se elige en tiempo de ejecución:
```typescript
// Inscripción → email
const notif = new EnrollmentNotification(new EmailNotificationChannel());
await notif.notify("estudiante@uni.edu", {
  courseName: "TypeScript Avanzado",
  studentName: "Ana García",
  instructorName: "Prof. Martínez",
});

// Pago confirmado → consola (ej. entorno de desarrollo)
const paymentNotif = new PaymentNotification(new ConsoleNotificationChannel());
await paymentNotif.notify("ana@uni.edu", {
  amount: "49.99",
  provider: "stripe",
  transactionId: "txn_abc123",
});
```

### Bridge vs herencia

Sin Bridge, cada combinación de (tipo de evento, canal) exige su propia clase. Con 3 tipos de notificación y 2 canales ya son 6 clases; añadir un tercer canal (SMS) implicaría 3 clases nuevas en vez de una sola. El **Bridge** reduce ese crecimiento de multiplicativo a aditivo, y permite cambiar el canal de una notificación en tiempo de ejecución simplemente inyectando un `INotificationChannel` diferente, sin tocar ninguna de las clases de notificación existentes.

---

## Patrón Composite — Árbol de contenido del curso y canal de notificación múltiple

### El problema

El LMS tiene dos situaciones donde el patrón Composite es la solución natural:

1. **Árbol de contenido del curso**: un `Course` contiene `Module`s. Al calcular la duración total de un curso, el llamador no debería tener que iterar manualmente la lista de módulos; debería poder llamar `getDuration()` sobre el curso y obtener el total sin importar cuántos módulos existan.

2. **Canal de notificación múltiple**: cuando un estudiante se inscribe, el sistema necesita enviar la notificación por email Y dejar un registro en consola. Sin Composite, el llamador tendría que llamar `send()` dos veces sobre dos canales distintos, acoplándose a la lista concreta de canales activos.

| Aspecto               | Sin Composite                                       | Con Composite                                             |
|-----------------------|-----------------------------------------------------|-----------------------------------------------------------|
| Duración del curso    | El llamador itera módulos y suma duraciones         | `courseTree.getDuration()` devuelve el total              |
| Nuevos tipos de nodo  | Cambiar todos los clientes que iteran la lista      | Implementar `ICourseContent` en el nuevo tipo             |
| Envío multi-canal     | El llamador hace `canal1.send(); canal2.send()`     | `compositeChannel.send()` despacha a todos               |
| Añadir un canal nuevo | Modificar todos los llamadores                      | `compositeChannel.add(new SMSChannel())`                  |
| Tratamiento uniforme  | `if (esHoja) … else iterarHijos`                    | Misma llamada `getDuration()` en hoja y compuesto         |

### Diagrama — Árbol de contenido

```
          «interface»
     ┌──────────────────────────────────┐
     │         ICourseContent           │  ← Component
     │  + id: string                    │
     │  + title: string                 │
     │  + getDescription(): string      │
     │  + getDuration(): number         │
     │  + getChildren(): ICourseContent[]│
     │  + isLeaf(): boolean             │
     └─────────────┬────────────────────┘
                   │ implements
        ┌──────────┴──────────────────┐
        │                             │
┌───────▼──────────┐       ┌──────────▼──────────────┐
│  ModuleContent   │       │      CourseContent        │  ← Composite
│  - module: Module│       │  - course: Course         │
│  + getDuration() │       │  - children: ICourseContent[]│
│    → 5 ó 10 min  │       │  + add(content)           │
│  + isLeaf()→true │       │  + remove(content)        │
│  + getChildren() │       │  + getDuration() → Σhijos │
│    → []          │       │  + isLeaf()→false         │
└──────────────────┘       └───────────────────────────┘
     ↑ Leaf

Árbol en tiempo de ejecución:
  CourseContent("TypeScript Avanzado")
  ├── ModuleContent("Módulo 1 — Tipos")       10 min (con video)
  ├── ModuleContent("Módulo 2 — Genéricos")   10 min (con video)
  └── ModuleContent("Módulo 3 — Texto")        5 min (sin video)
                                   Total: 25 min
```

### Diagrama — Canal compuesto

```
          «interface»
     ┌──────────────────────────────┐
     │      INotificationChannel    │  ← Component (Bridge Implementor)
     │  + send(to, subject, body)   │
     └────────────┬─────────────────┘
                  │ implements
     ┌────────────┼──────────────────────────────────┐
     │            │                                  │
┌────▼──────────┐ ┌────────────────────────┐ ┌──────▼──────────────────┐
│ EmailChannel  │ │CompositeNotification   │ │  ConsoleChannel         │
│ + send(…)     │ │Channel                 │ │  + send(…)              │
└───────────────┘ │ - channels: INotif[]   │ └─────────────────────────┘
     ↑ Leaf       │ + add(channel)         │         ↑ Leaf
                  │ + remove(channel)      │
                  │ + send(…)              │
                  │   → Promise.all(…)     │  ← Composite
                  └────────────────────────┘
                          │ contiene
                  ┌───────┴──────────────┐
                  │                      │
            EmailChannel         ConsoleChannel
```

### Fragmentos de código

**Component** — interfaz común para hojas y compuestos (`src/domain/composite/ICourseContent.ts`):
```typescript
export interface ICourseContent {
  readonly id: string;
  readonly title: string;
  getDescription(): string;
  getDuration(): number;
  getChildren(): ICourseContent[];
  isLeaf(): boolean;
}
```

**Leaf** — nodo terminal que envuelve un Module (`src/domain/composite/ModuleContent.ts`):
```typescript
export class ModuleContent implements ICourseContent {
  constructor(private readonly module: Module) {}

  getDuration(): number {
    return this.module.videoUrl ? 10 : 5; // minutos estimados
  }
  getChildren(): ICourseContent[] { return []; }
  isLeaf(): boolean { return true; }
}
```

**Composite** — nodo raíz que agrega hijos (`src/domain/composite/CourseContent.ts`):
```typescript
export class CourseContent implements ICourseContent {
  private children: ICourseContent[] = [];

  getDuration(): number {
    return this.children.reduce((t, c) => t + c.getDuration(), 0);
  }
  add(content: ICourseContent): void { this.children.push(content); }
  remove(content: ICourseContent): void {
    this.children = this.children.filter(c => c !== content);
  }
  isLeaf(): boolean { return false; }
}
```

**Canal Composite** — fanout concurrente (`src/infrastructure/notifications/channels/CompositeNotificationChannel.ts`):
```typescript
export class CompositeNotificationChannel implements INotificationChannel {
  private channels: INotificationChannel[] = [];

  add(channel: INotificationChannel): void { this.channels.push(channel); }
  remove(channel: INotificationChannel): void {
    this.channels = this.channels.filter(c => c !== channel);
  }
  async send(to: string, subject: string, body: string): Promise<void> {
    await Promise.all(this.channels.map(c => c.send(to, subject, body)));
  }
}
```

**Uso en el Facade** — árbol construido y consultado sin conocer su estructura interna:
```typescript
const overview = await courseManagementFacade.getCourseOverview("course-abc");
console.log(`Duración total: ${overview.totalDurationMinutes} minutos`);
// → "Duración total: 25 minutos"

// getDuration() funciona igual sobre hoja o compuesto (tratamiento uniforme)
const modulo = new ModuleContent(algünMódulo);   // isLeaf() → true
const curso   = new CourseContent(algúnCurso);   // isLeaf() → false
curso.add(modulo);
console.log(modulo.getDuration()); // 10
console.log(curso.getDuration());  // 10 (suma de hijos)
```

### Composite vs iteración manual

Sin Composite, cada nuevo lugar del código que necesite la duración total del curso debe conocer que un curso tiene módulos, que hay que iterar esa lista, y que la duración de cada módulo depende de si tiene `videoUrl`. Con Composite, esa lógica está encapsulada en `getDuration()` y el llamador no necesita conocer ningún detalle estructural. Si en el futuro un módulo pudiera contener sub-módulos, solo se añadiría un nuevo nodo Composite sin tocar ningún llamador existente.

---

## Patrón Facade — Simplificación de flujos complejos de coordinación

### El problema

El LMS tiene dos flujos que requieren coordinar múltiples servicios en un orden específico:

**Flujo de inscripción** (hasta 4 subsistemas): verificar curso → procesar pago (si premium) → crear inscripción → enviar notificaciones. Sin Facade, el controlador de API tendría que importar y coordinar `CourseService`, `PaymentService`, `EnrollmentService` y dos clases de notificación, manejar la condicional del tipo de curso y gestionar errores en cada paso.

**Flujo de creación de curso** (3 servicios + Composite): crear curso → añadir módulos → crear evaluación → construir árbol Composite. Además, `getCourseOverview` necesita lanzar tres consultas en paralelo y luego construir el árbol.

| Aspecto                    | Sin Facade                                          | Con Facade                                              |
|----------------------------|-----------------------------------------------------|---------------------------------------------------------|
| Dependencias del llamador  | Importa 5+ servicios/clases                         | Importa 1 facade                                        |
| Lógica condicional (pago)  | El llamador decide si llamar a PaymentService       | La Facade decide internamente según `course.type`       |
| Consultas paralelas        | El llamador gestiona `Promise.all` manualmente      | `getCourseOverview` las orquesta internamente           |
| Árbol Composite            | El llamador construye el árbol tras cada consulta   | La Facade construye y devuelve el árbol listo           |
| Notificaciones fallidas    | El llamador decide si revertir o continuar          | La Facade usa best-effort (warn, no lanza)              |
| Tests                      | Requieren mockear cada subsistema individualmente   | Se mockea la Facade completa                            |

### Diagrama

```
                 ┌──────────────────────────────────────────────────┐
                 │                 LearningFacade                   │  ← Facade
                 │                                                  │
  «llamador»     │  enrollStudent(userId, courseId, paymentInput?)   │
  ────────────▶  │    1. courseService.getCourse()                  │
                 │    2. paymentService.processPayment() [si premium]│
                 │    3. enrollmentService.enroll()                  │
                 │    4. enrollmentNotification.notify()             │
                 │    5. paymentNotification.notify() [si hubo pago] │
                 │                                                  │
                 └──┬──────────┬────────────┬────────────┬──────────┘
                    │          │            │            │
            ┌───────▼─┐  ┌────▼────┐  ┌───▼─────┐  ┌──▼──────────────────┐
            │ Course  │  │Payment  │  │Enrollment│  │  EnrollmentNotif.   │
            │ Service │  │ Service │  │ Service  │  │  PaymentNotif.      │
            └─────────┘  └─────────┘  └──────────┘  │  (CompositeChannel) │
                                                     └────────────────────┘

                 ┌──────────────────────────────────────────────────┐
                 │           CourseManagementFacade                 │  ← Facade
                 │                                                  │
  «llamador»     │  createCourseWithContent(dto)                    │
  ────────────▶  │    1. courseService.createCourse()               │
                 │    2. courseService.addModule() × N              │
                 │    3. evaluationService.createEvaluation() [opc] │
                 │    4. buildContentTree() → CourseContent         │
                 │                                                  │
  «llamador»     │  getCourseOverview(courseId)                     │
  ────────────▶  │    Promise.all([getCourse, getModules, getEvals])│
                 │    buildContentTree() → CourseContent            │
                 │    → { course, modules, evaluations, tree, min } │
                 └──┬───────────────────┬─────────────────────────┘
                    │                   │
            ┌───────▼─┐         ┌───────▼──────────┐
            │ Course  │         │  Evaluation       │
            │ Service │         │  Service          │
            └─────────┘         └──────────────────┘
```

### Fragmentos de código

**LearningFacade** — punto de entrada del flujo de inscripción (`src/infrastructure/facades/LearningFacade.ts`):
```typescript
async enrollStudent(
  userId: string,
  courseId: string,
  paymentInput?: PaymentInput
): Promise<EnrollmentResultDTO> {
  // Paso 1: verificar existencia y tipo del curso
  const course = await this.courseService.getCourse(courseId);

  // Paso 2: pago condicional (solo cursos premium)
  let payment = undefined;
  if (course.type === "premium") {
    if (!paymentInput) throw new Error("Se requieren datos de pago para curso premium");
    payment = await this.paymentService.processPayment({ userId, courseId, ...paymentInput });
  }

  // Paso 3: inscripción
  const enrollment = await this.enrollmentService.enroll(userId, courseId);

  // Paso 4: notificaciones (best-effort)
  let notified = false;
  try {
    const user = await this.userRepository.findById(userId);
    await this.enrollmentNotification.notify(user?.email ?? userId, {
      courseName: course.title,
      studentName: user?.name ?? userId,
    });
    if (payment) {
      await this.paymentNotification.notify(user?.email ?? userId, {
        userName: user?.name ?? userId,
        amount: String(payment.amount),
        provider: payment.provider,
        transactionId: payment.transactionId ?? "N/A",
      });
    }
    notified = true;
  } catch (error) {
    console.warn("[LearningFacade] Fallo al enviar notificaciones:", error);
  }

  return { enrollment, payment, notified };
}
```

**CourseManagementFacade** — consultas en paralelo y árbol Composite (`src/infrastructure/facades/CourseManagementFacade.ts`):
```typescript
async getCourseOverview(courseId: string): Promise<CourseOverviewDTO> {
  // Tres consultas en paralelo para minimizar latencia
  const [course, modules, evaluations] = await Promise.all([
    this.courseService.getCourse(courseId),
    this.courseService.getCourseModules(courseId),
    this.evaluationService.getEvaluationsByCourse(courseId),
  ]);

  const contentTree = this.buildContentTree(course, modules);
  return {
    course, modules, evaluations, contentTree,
    totalDurationMinutes: contentTree.getDuration(),
  };
}

private buildContentTree(course: Course, modules: Module[]): CourseContent {
  const tree = new CourseContent(course);
  modules.forEach(m => tree.add(new ModuleContent(m)));
  return tree;
}
```

**Wiring en el contenedor** (`src/container/index.ts`):
```typescript
// Composite: un canal que despacha a Email Y Console simultáneamente
const compositeChannel = new CompositeNotificationChannel();
compositeChannel.add(new EmailNotificationChannel());
compositeChannel.add(new ConsoleNotificationChannel());

export const learningFacade = new LearningFacade(
  courseService,
  paymentService,
  enrollmentService,
  new EnrollmentNotification(compositeChannel),
  new PaymentNotification(compositeChannel),
  userRepo
);

export const courseManagementFacade = new CourseManagementFacade(
  courseService,
  evaluationService
);
```

### Facade vs coordinación manual

La Facade no añade lógica de negocio — toda la validación real sigue en los servicios. Lo que aporta es **orden y ocultación de complejidad estructural**: el llamador no necesita saber que hay cuatro pasos, que el segundo es condicional, que el cuarto es best-effort o que las consultas de resumen pueden paralelizarse. Cambiar el flujo (por ejemplo, añadir verificación de cupo) requiere modificar solo la Facade, sin tocar ningún llamador.
