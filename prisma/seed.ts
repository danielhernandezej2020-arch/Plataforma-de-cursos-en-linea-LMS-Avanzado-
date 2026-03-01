import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create users
  const student = await prisma.user.create({
    data: {
      email: "student@lms.local",
      name: "Ana García",
      role: "student",
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: "instructor@lms.local",
      name: "Carlos López",
      role: "instructor",
    },
  });

  console.log(`Created users: ${student.name}, ${instructor.name}`);

  // Create courses using different types
  const freeCourse = await prisma.course.create({
    data: {
      title: "Introducción a TypeScript",
      description: "Aprende los fundamentos de TypeScript desde cero",
      type: "free",
      price: 0,
      instructorId: instructor.id,
      category: "programming",
    },
  });

  const premiumCourse = await prisma.course.create({
    data: {
      title: "Arquitectura de Software Avanzada",
      description: "Patrones de diseño, Clean Architecture y SOLID",
      type: "premium",
      price: 49.99,
      instructorId: instructor.id,
      category: "programming",
    },
  });

  const anotherCourse = await prisma.course.create({
    data: {
      title: "Machine Learning con Python",
      description: "Fundamentos de ML y redes neuronales",
      type: "premium",
      price: 79.99,
      instructorId: instructor.id,
      category: "data-science",
    },
  });

  console.log(`Created courses: ${freeCourse.title}, ${premiumCourse.title}, ${anotherCourse.title}`);

  // Add modules
  await prisma.module.createMany({
    data: [
      {
        courseId: freeCourse.id,
        title: "Tipos Básicos",
        content: "string, number, boolean, arrays y tuplas",
        orderIndex: 1,
      },
      {
        courseId: freeCourse.id,
        title: "Interfaces y Types",
        content: "Definición de contratos y tipos personalizados",
        orderIndex: 2,
      },
      {
        courseId: premiumCourse.id,
        title: "Singleton Pattern",
        content: "Patrón creacional para instancias únicas",
        orderIndex: 1,
      },
      {
        courseId: premiumCourse.id,
        title: "Factory Method Pattern",
        content: "Patrón creacional para crear objetos sin especificar su clase concreta",
        orderIndex: 2,
      },
    ],
  });

  console.log("Created modules");

  // Create evaluations
  await prisma.evaluation.create({
    data: {
      courseId: freeCourse.id,
      title: "Quiz: Tipos Básicos",
      type: "quiz",
      passingScore: 70,
      questions: [
        {
          question: "¿Cuál es el tipo para texto en TypeScript?",
          options: ["text", "string", "str", "varchar"],
          correctIndex: 1,
        },
        {
          question: "¿Cómo se define un array de números?",
          options: ["number[]", "Array(number)", "int[]", "nums"],
          correctIndex: 0,
        },
        {
          question: "¿TypeScript es un superset de?",
          options: ["Java", "Python", "JavaScript", "C#"],
          correctIndex: 2,
        },
      ],
    },
  });

  await prisma.evaluation.create({
    data: {
      courseId: premiumCourse.id,
      title: "Proyecto: Implementar Patrón Observer",
      type: "project",
      passingScore: 60,
      questions: [
        { criteria: "Implementación correcta del patrón", maxScore: 40 },
        { criteria: "Uso de interfaces TypeScript", maxScore: 30 },
        { criteria: "Tests unitarios", maxScore: 30 },
      ],
    },
  });

  console.log("Created evaluations");

  console.log("\n--- Seed data summary ---");
  console.log(`Student ID: ${student.id}`);
  console.log(`Instructor ID: ${instructor.id}`);
  console.log(`Free Course ID: ${freeCourse.id}`);
  console.log(`Premium Course ID: ${premiumCourse.id}`);
  console.log(`Another Course ID: ${anotherCourse.id}`);
  console.log("-------------------------\n");
  console.log("Use these IDs to test the API endpoints!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
