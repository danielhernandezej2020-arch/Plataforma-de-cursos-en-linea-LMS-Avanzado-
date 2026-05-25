"use client";

import { useCallback, useMemo, useState } from "react";
import {
  AllCoursesStrategy,
  CategoryFilterStrategy,
  ComposedFilterStrategy,
  SearchFilterStrategy,
  SORT_STRATEGIES,
  type CourseData,
} from "../patterns/strategies/CourseFilterStrategy";

/**
 * Encapsula el filtrado y ordenamiento de cursos usando Strategy.
 * Sustituye la lógica inline de filter/sort que existía en courses/page.tsx
 * y corrige el bug donde `sort` se ignoraba en la lista resultante.
 */
export function useCourseFilter(allCourses: CourseData[]) {
  const [filter, setFilter] = useState("all");
  const [sort, setSort]     = useState("Featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const filterStrategy = new ComposedFilterStrategy([
      filter === "all"
        ? new AllCoursesStrategy()
        : new CategoryFilterStrategy(filter),
      new SearchFilterStrategy(search),
    ]);
    const sortStrategy = SORT_STRATEGIES[sort] ?? SORT_STRATEGIES["Featured"];
    return sortStrategy.sort(filterStrategy.filter(allCourses));
  }, [allCourses, filter, sort, search]);

  const reset = useCallback(() => {
    setFilter("all");
    setSearch("");
    setSort("Featured");
  }, []);

  return { filtered, filter, sort, search, setFilter, setSort, setSearch, reset };
}
