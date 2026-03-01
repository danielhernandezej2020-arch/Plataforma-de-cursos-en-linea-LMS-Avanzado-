import LMSApp from "./components/LMSApp";

async function getCourses() {
  try {
    const res = await fetch("http://localhost:3000/api/courses", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const courses = await getCourses();
  return <LMSApp initialCourses={courses} />;
}
