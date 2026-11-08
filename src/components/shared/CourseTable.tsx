import { ExternalLink } from "lucide-react";
import { courses } from "@/content/achievements";
import type { Course } from "@/types/content";
import { cn } from "@/lib/utils";

const platformTone: Record<Course["platform"], string> = {
  NPTEL: "bg-primary-soft text-primary",
  Udemy: "bg-accent-soft text-accent",
};

/** Completed online courses with platform, credit points, duration and a link to verify each certificate. */
export function CourseTable({ items = courses, compact = false }: { items?: Course[]; compact?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line">
      <table className={cn("w-full min-w-[36rem] text-left tabular-nums", compact ? "text-sm" : "text-[0.95rem]")}>
        <caption className="sr-only">Completed courses with platform, credit points, duration and verification link</caption>
        <thead className="bg-surface-2/70">
          <tr className="text-ink">
            <th scope="col" className="px-3 py-2 font-medium">Course title</th>
            <th scope="col" className="px-3 py-2 font-medium">Platform</th>
            <th scope="col" className="px-3 py-2 font-medium">Credit points</th>
            <th scope="col" className="px-3 py-2 font-medium">Duration</th>
            <th scope="col" className="px-3 py-2 font-medium">Verification</th>
          </tr>
        </thead>
        <tbody>
          {items.map((course) => (
            <tr key={course.verifyUrl} className="border-t border-line">
              <th scope="row" className="px-3 py-2 font-normal text-ink">
                {course.title}
                <span className="block text-xs text-muted">{course.topic}, {course.year}</span>
              </th>
              <td className="px-3 py-2">
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", platformTone[course.platform])}>{course.platform}</span>
              </td>
              <td className="px-3 py-2">{course.credits}</td>
              <td className="px-3 py-2 whitespace-nowrap">{course.duration}</td>
              <td className="px-3 py-2">
                <a href={course.verifyUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-6 items-center gap-1 whitespace-nowrap" aria-label={`Verify the ${course.title} certificate on ${course.platform}`}>
                  Verify
                  <ExternalLink className="size-3.5" aria-hidden />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
