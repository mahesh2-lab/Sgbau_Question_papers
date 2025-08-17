export type Notification = {
  id: string;
  title: string;
  message: string;
  category: string; // e.g., exam, results, academic, scholarship, maintenance, notice
  severity?: "info" | "warning" | "critical";
  createdAt: string; // ISO date
};

export const notificationCategories = [
  "exam",
  "results",
  "academic",
  "scholarship",
  "maintenance",
  "notice",
];

// Academic / engineering study related mock notifications
export const notificationsMock: Notification[] = [
  {
    id: "1",
    title: "Semester VI Results Announced",
    message:
      "BE (CSE / IT / ECE) Semester VI results are now published on the university portal. Revaluation window opens tomorrow 10:00 IST.",
    category: "results",
    severity: "info",
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    title: "Mid-Term Exam Timetable Updated",
    message:
      "Revised schedule: Data Structures mid-term moved to 21 Mar 10:00 AM due to lab maintenance. Download the updated PDF timetable.",
    category: "exam",
    severity: "warning",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    title: "Urgent: Lab Network Outage Resolved",
    message:
      "Network interruption in Embedded Systems lab (Block B, Floor 2) from 11:05–11:32 IST. Practical sessions may be rescheduled section-wise.",
    category: "maintenance",
    severity: "critical",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    title: "GATE Preparation Workshop Registration",
    message:
      "Registration open for intensive 2-week GATE prep workshop (Systems + Algorithms focus). Seats limited to 120. Closes Friday 18:00 IST.",
    category: "academic",
    severity: "info",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    title: "Merit Scholarship Application Window",
    message:
      "Applications for 2025 Engineering Merit & Need-Based scholarships open. Submit transcripts + recommendation letter by 30 Apr 23:59 IST.",
    category: "scholarship",
    severity: "warning",
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "6",
    title: "Internal Hackathon Results Posted",
    message:
      "Top project: Smart Energy Load Balancer (Team Photon). Project briefs & repo links now available for reference in the resources section.",
    category: "results",
    severity: "info",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "7",
    title: "Academic Calendar Minor Revision",
    message:
      "Capstone project interim review shifted to Week 9 (instead of Week 8). Updated calendar PDF reflects the change (v2.1).",
    category: "notice",
    severity: "info",
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
  },
];
