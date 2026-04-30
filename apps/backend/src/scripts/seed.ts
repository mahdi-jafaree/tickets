import type { EntityManager } from "typeorm";
import { Ticket } from "../entities/Ticket";

const STATUSES = ["open", "in_progress", "resolved", "closed"] as const;
const PRIORITIES = ["low", "medium", "high", "critical"] as const;

const TITLES = [
	"Login page not loading",
	"Password reset email not received",
	"Dashboard crashes on filter",
	"Export to CSV produces empty file",
	"Slow response on search endpoint",
	"Profile picture upload fails",
	"Notification bell shows wrong count",
	"Dark mode toggle broken",
	"Date picker shows wrong timezone",
	"API returns 500 on large payloads",
	"Mobile layout broken on iOS 17",
	"Session expires too quickly",
	"Two-factor auth not working",
	"Invoice PDF missing line items",
	"Email notifications delayed by 1 hour",
	"Pagination resets on sort",
	"User cannot update their email",
	"Search returns duplicate results",
	"Dropdown menu clips off screen",
	"Attachment download returns 403",
	"Report generation times out",
	"Sidebar collapses unexpectedly",
	"Browser tab title shows undefined",
	"Form submission hangs on slow connection",
	"Role assignment not saving",
];

const DESCRIPTIONS = [
	"Reproducible in all major browsers. Steps: 1. Navigate to the page, 2. Observe the issue.",
	"User reported this via support ticket. Priority escalated after multiple reports.",
	"Occurs intermittently under high load. Likely a race condition.",
	"Regression introduced in the last deployment. Rollback being considered.",
	"Affects users in the EU timezone only. Related to locale settings.",
	"Only reproducible with specific file types above 5MB.",
	"First reported by QA during regression testing. Not present in staging.",
	"Console shows a null reference error. Stack trace attached.",
	"Confirmed in production. No workaround available at this time.",
	"Intermittent — occurs roughly 1 in 10 attempts. Hard to reproduce reliably.",
];

function pick<T>(arr: readonly T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedTickets(manager: EntityManager): Promise<void> {
	const repo = manager.getRepository(Ticket);

	const existing = await repo.count();
	if (existing > 0) {
		console.log(`Seeder: skipped — ${existing} tickets already exist.`);
		return;
	}

	const tickets: Partial<Ticket>[] = Array.from({ length: 250 }, (_, i) => ({
		title: `${pick(TITLES)} (#${i + 1})`,
		description: pick(DESCRIPTIONS),
		status: pick(STATUSES),
		priority: pick(PRIORITIES),
		assignedTo: null,
	}));

	await repo.insert(tickets as Ticket[]);
	console.log("Seeder: inserted 250 tickets.");
}
