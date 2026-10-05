export interface Competency {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export const competencies: Competency[] = [
  {
    id: "problem-solving",
    title: "Problem Solving & Persistence",
    description: "Breaking down obstacles and keeping a consistent habit of learning.",
    tags: ["Problem Solving", "Automation", "Refactoring", "기록", "꾸준함"],
  },
  {
    id: "communication",
    title: "Communication & Coordination",
    description: "Aligning opinions and resolving friction within a team.",
    tags: ["Collaboration", "Conflict Resolution", "의견 조율 능력", "Teamwork"],
  },
  {
    id: "language",
    title: "Language & Global",
    description: "Working and communicating across languages.",
    tags: ["English Proficiency", "Japanese", "Global"],
  },
  {
    id: "analysis",
    title: "Analysis & Engineering",
    description: "Understanding systems in depth and improving their performance.",
    tags: ["Analysis", "Computer Architecture", "Algorithm", "Optimization"],
  },
];