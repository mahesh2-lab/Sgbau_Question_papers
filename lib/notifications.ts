export type Notification = {
  id: string;
  title: string;
  message: string;
  category: string; // e.g., exam, results, academic, scholarship, maintenance, notice
  severity?: "Info" | "Warning" | "Error" | "Critical";
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
