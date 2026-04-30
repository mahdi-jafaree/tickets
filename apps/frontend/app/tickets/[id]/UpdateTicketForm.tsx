"use client";
import type { SafeAccount } from "@tickets/backend";
import type { Ticket } from "@tickets/backend/src/entities";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTicket } from "../../../utils/actions/updateTicket";

type Props = {
	ticket: Ticket;
	accounts: SafeAccount[];
};

const STATUS_OPTIONS = [
	{ value: "open", label: "Open" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "resolved", label: "Resolved" },
	{ value: "closed", label: "Closed" },
];

const PRIORITY_OPTIONS = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
	{ value: "critical", label: "Critical" },
];

export default function UpdateTicketForm({ ticket, accounts }: Props) {
	const router = useRouter();
	const [status, setStatus] = useState(ticket.status);
	const [priority, setPriority] = useState(ticket.priority);
	const [assignedTo, setAssignedTo] = useState<string>(
		ticket.assignedTo?.id ?? "",
	);
	const [error, setError] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setError(null);

		const res = await updateTicket(ticket.id, {
			status,
			priority,
			assignedTo: assignedTo || null,
		});

		setSaving(false);

		if (res && "error" in res && res.error) {
			setError(res.error.message || "Failed to update ticket");
			return;
		}

		router.refresh();
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			{error && (
				<p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
					{error}
				</p>
			)}

			<div>
				<label
					htmlFor="status"
					className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Status
				</label>
				<select
					id="status"
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
				>
					{STATUS_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					htmlFor="priority"
					className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Priority
				</label>
				<select
					id="priority"
					value={priority}
					onChange={(e) => setPriority(e.target.value)}
					className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
				>
					{PRIORITY_OPTIONS.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			<div>
				<label
					htmlFor="assignedTo"
					className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
				>
					Assignee
				</label>
				<select
					id="assignedTo"
					value={assignedTo}
					onChange={(e) => setAssignedTo(e.target.value)}
					className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
				>
					<option value="">Unassigned</option>
					{accounts.map((acc) => (
						<option key={acc.id} value={acc.id}>
							{acc.firstName} {acc.lastName}
						</option>
					))}
				</select>
			</div>

			<button
				type="submit"
				disabled={saving}
				className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
			>
				{saving ? "Saving…" : "Save Changes"}
			</button>
		</form>
	);
}
