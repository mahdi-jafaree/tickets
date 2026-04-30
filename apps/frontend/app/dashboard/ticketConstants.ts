export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

export const STATUS_LABEL: Record<TicketStatus, string> = {
	open: "Open",
	in_progress: "In Progress",
	resolved: "Resolved",
	closed: "Closed",
};

export const STATUS_STYLES: Record<TicketStatus, string> = {
	open: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
	in_progress:
		"bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
	resolved:
		"bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400",
	closed: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

export const PRIORITY_LABEL: Record<TicketPriority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
	critical: "Critical",
};

export const PRIORITY_STYLES: Record<TicketPriority, string> = {
	low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
	medium: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
	high: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
	critical: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};
