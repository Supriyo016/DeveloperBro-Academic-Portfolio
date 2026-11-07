import type { Achievement, Course } from "@/types/content";

export const achievements: Achievement[] = [
  {
    title: "M.Tech in Computer Science and Engineering",
    detail: "Completed at Kalyani Government Engineering College (MAKAUT, WB).",
    year: "2026",
    group: "Academic achievements",
  },
  {
    title: "B.Tech in Computer Science and Engineering",
    detail: "Completed at Regent Education & Research Foundation (MAKAUT, WB).",
    year: "2024",
    group: "Academic achievements",
  },
  {
    title: "WB PGET 2025",
    detail: "Qualified with Rank 43.",
    year: "2025",
    group: "Competitive examinations",
  },
  {
    title: "Smart India Hackathon 2022",
    detail: "Selected to develop the Tour India travel website.",
    year: "2022",
    group: "Hackathons",
    href: "/projects/tour-india",
  },
];

export const courses: Course[] = [
  { title: "Deep Learning", provider: "NPTEL", topic: "Machine Learning" },
  { title: "Python for Data Science", provider: "NPTEL", topic: "Machine Learning" },
  { title: "The Joy of Computing Using Python", provider: "NPTEL", topic: "Programming" },
  { title: "Crash Course on Python", provider: "Google / Coursera", topic: "Programming" },
  { title: "Learn C++ Programming: Beginner to Advanced", provider: "Udemy", topic: "Programming" },
  { title: "CSS, Bootstrap, JavaScript and PHP Stack Complete Course", provider: "Udemy", topic: "Web Development" },
  { title: "Soft Skills", provider: "NPTEL", topic: "Professional Skills" },
];
