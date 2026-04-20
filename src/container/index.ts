import { db } from "@/infrastructure/database/PrismaClient";
import { PrismaCourseRepository } from "@/infrastructure/repositories/PrismaCourseRepository";
import { PrismaModuleRepository } from "@/infrastructure/repositories/PrismaModuleRepository";
import { PrismaEvaluationRepository } from "@/infrastructure/repositories/PrismaEvaluationRepository";
import { PrismaCertificateRepository } from "@/infrastructure/repositories/PrismaCertificateRepository";
import { PrismaPaymentRepository } from "@/infrastructure/repositories/PrismaPaymentRepository";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { PrismaEnrollmentRepository } from "@/infrastructure/repositories/PrismaEnrollmentRepository";
import { CourseFactory } from "@/infrastructure/factories/CourseFactory";
import { EvaluationFactory } from "@/infrastructure/factories/EvaluationFactory";
import { CertificateFactory } from "@/infrastructure/factories/CertificateFactory";
import { PaymentProviderFactory } from "@/infrastructure/factories/PaymentProviderFactory";
import { FreeTierContentFactory } from "@/infrastructure/factories/FreeTierContentFactory";
import { PremiumTierContentFactory } from "@/infrastructure/factories/PremiumTierContentFactory";
import { CourseService } from "@/application/services/CourseService";
import { EvaluationService } from "@/application/services/EvaluationService";
import { CertificateService } from "@/application/services/CertificateService";
import { PaymentService } from "@/application/services/PaymentService";
import { EnrollmentService } from "@/application/services/EnrollmentService";
import { PaymentProviderRegistry } from "@/infrastructure/payments/PaymentProviderRegistry";
import { LoggingPaymentDecorator } from "@/infrastructure/payments/decorators/LoggingPaymentDecorator";
import { RetryPaymentDecorator } from "@/infrastructure/payments/decorators/RetryPaymentDecorator";
import { EmailNotificationChannel } from "@/infrastructure/notifications/channels/EmailNotificationChannel";
import { ConsoleNotificationChannel } from "@/infrastructure/notifications/channels/ConsoleNotificationChannel";
import { CompositeNotificationChannel } from "@/infrastructure/notifications/channels/CompositeNotificationChannel";
import { EnrollmentNotification } from "@/infrastructure/notifications/EnrollmentNotification";
import { PaymentNotification } from "@/infrastructure/notifications/PaymentNotification";
import { LearningFacade } from "@/infrastructure/facades/LearningFacade";
import { CourseManagementFacade } from "@/infrastructure/facades/CourseManagementFacade";

// ─── SINGLETON: Database ─────────────────────────────
const prisma = db.getClient();

// ─── Repositories (depend on singleton DB) ───────────
const courseRepo = new PrismaCourseRepository(prisma);
const moduleRepo = new PrismaModuleRepository(prisma);
const evaluationRepo = new PrismaEvaluationRepository(prisma);
const certificateRepo = new PrismaCertificateRepository(prisma);
const paymentRepo = new PrismaPaymentRepository(prisma);
const userRepo = new PrismaUserRepository(prisma);
const enrollmentRepo = new PrismaEnrollmentRepository(prisma);

// ─── FACTORIES ───────────────────────────────────────
const courseFactory = new CourseFactory();
const evaluationFactory = new EvaluationFactory();
const certificateFactory = new CertificateFactory();
const paymentProviderFactory = new PaymentProviderFactory();

// ─── ABSTRACT FACTORIES (Content Tier Families) ──────
export const freeTierFactory = new FreeTierContentFactory(
  courseFactory,
  evaluationFactory,
  certificateFactory
);

export const premiumTierFactory = new PremiumTierContentFactory(
  courseFactory,
  evaluationFactory,
  certificateFactory
);

// ─── SINGLETON: Payment Provider Registry ────────────
// Patrón Decorator: los adaptadores base se envuelven con Retry y luego con Logging.
// El orden de envoltura importa: Logging es la capa más externa (registra la operación
// completa incluidos los reintentos), Retry es la capa intermedia.
const paymentRegistry = PaymentProviderRegistry.getInstance();
paymentRegistry.registerProvider(
  "stripe",
  new LoggingPaymentDecorator(
    new RetryPaymentDecorator(paymentProviderFactory.create("stripe"), 3)
  )
);
paymentRegistry.registerProvider(
  "paypal",
  new LoggingPaymentDecorator(
    new RetryPaymentDecorator(paymentProviderFactory.create("paypal"), 3)
  )
);

// ─── APPLICATION SERVICES ────────────────────────────
export const courseService = new CourseService(
  courseRepo,
  moduleRepo,
  courseFactory
);

export const evaluationService = new EvaluationService(
  evaluationRepo,
  evaluationFactory,
  enrollmentRepo
);

export const certificateService = new CertificateService(
  certificateRepo,
  certificateFactory,
  enrollmentRepo,
  courseRepo,
  userRepo
);

export const paymentService = new PaymentService(
  paymentRepo,
  paymentProviderFactory
);

export const enrollmentService = new EnrollmentService(
  enrollmentRepo,
  courseRepo,
  paymentRepo
);

// ─── COMPOSITE: Canal de notificación compuesto ──────────
// Un solo canal que despacha a Email Y Console simultáneamente.
// Para añadir SMS u otro canal: compositeChannel.add(new SMSNotificationChannel())
const compositeChannel = new CompositeNotificationChannel();
compositeChannel.add(new EmailNotificationChannel());
compositeChannel.add(new ConsoleNotificationChannel());

// ─── Bridge + Composite: notificaciones con canal compuesto ──
const enrollmentNotification = new EnrollmentNotification(compositeChannel);
const paymentNotification = new PaymentNotification(compositeChannel);

// ─── FACADES ─────────────────────────────────────────────
export const learningFacade = new LearningFacade(
  courseService,
  paymentService,
  enrollmentService,
  enrollmentNotification,
  paymentNotification,
  userRepo
);

export const courseManagementFacade = new CourseManagementFacade(
  courseService,
  evaluationService
);

// Re-export repositories for direct access in API routes (e.g., seed, users)
export const userRepository = userRepo;
export const enrollmentRepository = enrollmentRepo;
