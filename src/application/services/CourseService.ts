import { ICourseRepository } from "@/domain/repositories/ICourseRepository";
import { IModuleRepository } from "@/domain/repositories/IModuleRepository";
import { ICourseFactory } from "@/domain/factories/ICourseFactory";
import { CreateCourseDTO } from "@/application/dto/CreateCourseDTO";
import { Course } from "@/domain/entities/Course";
import { Module } from "@/domain/entities/Module";
import { v4 as uuidv4 } from "uuid";

export class CourseService {
  constructor(
    private courseRepository: ICourseRepository,
    private moduleRepository: IModuleRepository,
    private courseFactory: ICourseFactory
  ) {}

  async createCourse(dto: CreateCourseDTO): Promise<Course> {
    const course = this.courseFactory.create(dto); // FACTORY METHOD
    return this.courseRepository.save(course);
  }

  async getCourse(id: string): Promise<Course> {
    const course = await this.courseRepository.findById(id);
    if (!course) throw new Error("Course not found");
    return course;
  }

  async listCourses(): Promise<Course[]> {
    return this.courseRepository.findAll();
  }

  async addModule(
    courseId: string,
    data: { title: string; content: string; orderIndex: number; videoUrl?: string }
  ): Promise<Module> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course not found");

    const module: Module = {
      id: uuidv4(),
      courseId,
      title: data.title,
      content: data.content,
      orderIndex: data.orderIndex,
      videoUrl: data.videoUrl || null,
    };

    return this.moduleRepository.save(module);
  }

  async getCourseModules(courseId: string): Promise<Module[]> {
    return this.moduleRepository.findByCourseId(courseId);
  }
}
