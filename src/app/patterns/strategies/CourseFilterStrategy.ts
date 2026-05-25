export interface CourseData {
  id: string;
  title: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  price: number;
  type: "free" | "premium";
}

export interface ICourseFilterStrategy {
  readonly name: string;
  filter(courses: CourseData[]): CourseData[];
}

export interface ICourseSortStrategy {
  readonly name: string;
  sort(courses: CourseData[]): CourseData[];
}

// ── Estrategias de filtrado ───────────────────────────────────────────────────

export class AllCoursesStrategy implements ICourseFilterStrategy {
  readonly name = "all";
  filter(courses: CourseData[]): CourseData[] {
    return courses;
  }
}

export class CategoryFilterStrategy implements ICourseFilterStrategy {
  readonly name: string;
  constructor(private readonly category: string) {
    this.name = category;
  }
  filter(courses: CourseData[]): CourseData[] {
    return courses.filter(c => c.category === this.category);
  }
}

export class SearchFilterStrategy implements ICourseFilterStrategy {
  readonly name = "search";
  constructor(private readonly query: string) {}
  filter(courses: CourseData[]): CourseData[] {
    if (!this.query.trim()) return courses;
    const q = this.query.toLowerCase();
    return courses.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q),
    );
  }
}

/** Combina múltiples estrategias aplicándolas en cadena (AND lógico). */
export class ComposedFilterStrategy implements ICourseFilterStrategy {
  readonly name = "composed";
  constructor(private readonly strategies: ICourseFilterStrategy[]) {}
  filter(courses: CourseData[]): CourseData[] {
    return this.strategies.reduce((acc, s) => s.filter(acc), courses);
  }
}

// ── Estrategias de ordenamiento ───────────────────────────────────────────────

export class FeaturedSortStrategy implements ICourseSortStrategy {
  readonly name = "Featured";
  sort(courses: CourseData[]): CourseData[] {
    return [...courses];
  }
}

export class NewestSortStrategy implements ICourseSortStrategy {
  readonly name = "Newest";
  sort(courses: CourseData[]): CourseData[] {
    return [...courses].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }
}

export class HighestRatedSortStrategy implements ICourseSortStrategy {
  readonly name = "Highest Rated";
  sort(courses: CourseData[]): CourseData[] {
    return [...courses].sort((a, b) => b.rating - a.rating);
  }
}

export class PriceAscStrategy implements ICourseSortStrategy {
  readonly name = "Price: Low→High";
  sort(courses: CourseData[]): CourseData[] {
    return [...courses].sort((a, b) => a.price - b.price);
  }
}

export class PriceDescStrategy implements ICourseSortStrategy {
  readonly name = "Price: High→Low";
  sort(courses: CourseData[]): CourseData[] {
    return [...courses].sort((a, b) => b.price - a.price);
  }
}

export const SORT_STRATEGIES: Record<string, ICourseSortStrategy> = {
  "Featured":         new FeaturedSortStrategy(),
  "Newest":           new NewestSortStrategy(),
  "Highest Rated":    new HighestRatedSortStrategy(),
  "Price: Low→High":  new PriceAscStrategy(),
  "Price: High→Low":  new PriceDescStrategy(),
};
