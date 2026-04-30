"use client";

import Link from "next/link";
import { useState } from "react";

type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
type TicketPriority = "low" | "medium" | "high" | "critical";

interface Ticket {
	id: string;
	title: string;
	description: string;
	status: TicketStatus;
	priority: TicketPriority;
	assignedTo: string | null;
	createdAt: string;
}

const MOCK_TICKETS: Ticket[] = [
	{
		id: "1",
		title: "Login page returns 500 on wrong password",
		description:
			"Users see a 500 error instead of an invalid credentials message.",
		status: "open",
		priority: "high",
		assignedTo: "Jane Doe",
		createdAt: "2026-04-28",
	},
	{
		id: "2",
		title: "Dashboard charts not loading in Safari",
		description: "All chart widgets fail to render on Safari 17.",
		status: "in_progress",
		priority: "medium",
		assignedTo: "John Smith",
		createdAt: "2026-04-27",
	},
	{
		id: "3",
		title: "Add CSV export to ticket list",
		description:
			"Users want to export the current filtered ticket list as a CSV file.",
		status: "open",
		priority: "low",
		assignedTo: null,
		createdAt: "2026-04-26",
	},
	{
		id: "4",
		title: "Password reset email not delivered",
		description:
			"Reset emails are queued but never sent due to SMTP misconfiguration.",
		status: "resolved",
		priority: "critical",
		assignedTo: "Jane Doe",
		createdAt: "2026-04-25",
	},
	{
		id: "5",
		title: "Pagination breaks on last page",
		description:
			"Clicking next on the last page of results throws a client error.",
		status: "closed",
		priority: "low",
		assignedTo: "John Smith",
		createdAt: "2026-04-24",
	},
];

const STATUS_STYLES: Record<TicketStatus, string> = {
	open: "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-700",
	in_progress:
		"bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-700",
	resolved:
		"bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-700",
	closed:
		"bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700",
};

const PRIORITY_STYLES: Record<TicketPriority, string> = {
	low: "bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700",
	medium:
		"bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-700",
	high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:ring-orange-700",
	critical:
		"bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-700",
};

const STATUS_LABEL: Record<TicketStatus, string> = {
	open: "Open",
	in_progress: "In Progress",
	resolved: "Resolved",
	closed: "Closed",
};

const PRIORITY_LABEL: Record<TicketPriority, string> = {
	low: "Low",
	medium: "Medium",
	high: "High",
	critical: "Critical",
};

export default function DashboardPage() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
	const [showNewTicket, setShowNewTicket] = useState(false);

	const filtered = MOCK_TICKETS.filter((t) => {
		const matchesSearch =
			t.title.toLowerCase().includes(search.toLowerCase()) ||
			t.description.toLowerCase().includes(search.toLowerCase());
		const matchesStatus = statusFilter === "all" || t.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const counts = {
		open: MOCK_TICKETS.filter((t) => t.status === "open").length,
		in_progress: MOCK_TICKETS.filter((t) => t.status === "in_progress").length,
		resolved: MOCK_TICKETS.filter((t) => t.status === "resolved").length,
		closed: MOCK_TICKETS.filter((t) => t.status === "closed").length,
	};

	return (
		<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
			{/* Navbar */}
			<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
					<span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						Tickets
					</span>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
							JD
						</div>
						<Link
							href="/login"
							className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
						>
							Sign out
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
				{/* Page title + new ticket button */}
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
							All Tickets
						</h1>
						<p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
							{MOCK_TICKETS.length} tickets total
						</p>
					</div>
					<button
						type="button"
						onClick={() => setShowNewTicket(true)}
						className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="size-4"
							aria-hidden="true"
						>
							<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
						</svg>
						New Ticket
					</button>
				</div>

				{/* Stat cards */}
				<div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
					{(["open", "in_progress", "resolved", "closed"] as const).map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
							className={`rounded-xl border px-4 py-3 text-left transition ${
								statusFilter === s
									? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20"
									: "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
							}`}
						>
							<p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
								{counts[s]}
							</p>
							<p className="mt-0.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
								{STATUS_LABEL[s]}
							</p>
						</button>
					))}
				</div>

				{/* Filters */}
				<div className="mb-4 flex flex-col gap-3 sm:flex-row">
					<div className="relative flex-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
								clipRule="evenodd"
							/>
						</svg>
						<input
							type="search"
							placeholder="Search tickets…"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
						/>
					</div>
					<select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(e.target.value as TicketStatus | "all")
						}
						className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
					>
						<option value="all">All statuses</option>
						<option value="open">Open</option>
						<option value="in_progress">In Progress</option>
						<option value="resolved">Resolved</option>
						<option value="closed">Closed</option>
					</select>
				</div>

				{/* Ticket table */}
				<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
					{filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center px-6 py-16 text-center">
							<p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
								No tickets match your filters.
							</p>
						</div>
					) : (
						<table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
							<thead>
								<tr className="bg-zinc-50 dark:bg-zinc-800/50">
									<th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
										Title
									</th>
									<th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:table-cell">
										Status
									</th>
									<th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 md:table-cell">
										Priority
									</th>
									<th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 lg:table-cell">
										Assigned To
									</th>
									<th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 lg:table-cell">
										Created
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
								{filtered.map((ticket) => (
									<tr
										key={ticket.id}
										className="group cursor-pointer transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
									>
										<td className="px-4 py-3.5">
											<p className="text-sm font-medium text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-50 dark:group-hover:text-indigo-400">
												{ticket.title}
											</p>
											<p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
												{ticket.description}
											</p>
											<div className="mt-1.5 flex items-center gap-2 sm:hidden">
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status]}`}
												>
													{STATUS_LABEL[ticket.status]}
												</span>
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[ticket.priority]}`}
												>
													{PRIORITY_LABEL[ticket.priority]}
												</span>
											</div>
										</td>
										<td className="hidden px-4 py-3.5 sm:table-cell">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[ticket.status]}`}
											>
												{STATUS_LABEL[ticket.status]}
											</span>
										</td>
										<td className="hidden px-4 py-3.5 md:table-cell">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[ticket.priority]}`}
											>
												{PRIORITY_LABEL[ticket.priority]}
											</span>
										</td>
										<td className="hidden px-4 py-3.5 lg:table-cell">
											{ticket.assignedTo ? (
												<span className="text-sm text-zinc-700 dark:text-zinc-300">
													{ticket.assignedTo}
												</span>
											) : (
												<span className="text-sm text-zinc-400 dark:text-zinc-500">
													Unassigned
												</span>
											)}
										</td>
										<td className="hidden px-4 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell">
											{ticket.createdAt}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</main>

			{/* New Ticket Modal */}
			{showNewTicket && (
				<NewTicketModal onClose={() => setShowNewTicket(false)} />
			)}
		</div>
	);
}

function NewTicketModal({ onClose }: { onClose: () => void }) {
	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		// TODO: wire up API
		onClose();
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
			<div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
				<div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
					<h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						New Ticket
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
						aria-label="Close"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							className="size-4"
							aria-hidden="true"
						>
							<path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
						</svg>
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="new-title"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							Title
						</label>
						<input
							id="new-title"
							name="title"
							type="text"
							required
							className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
							placeholder="Short description of the issue"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="new-desc"
							className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
						>
							Description
						</label>
						<textarea
							id="new-desc"
							name="description"
							required
							rows={3}
							className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
							placeholder="Detailed description…"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="new-status"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Status
							</label>
							<select
								id="new-status"
								name="status"
								required
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
							>
								<option value="open">Open</option>
								<option value="in_progress">In Progress</option>
								<option value="resolved">Resolved</option>
								<option value="closed">Closed</option>
							</select>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="new-priority"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Priority
							</label>
							<select
								id="new-priority"
								name="priority"
								required
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
							>
								<option value="low">Low</option>
								<option value="medium">Medium</option>
								<option value="high">High</option>
								<option value="critical">Critical</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-1">
						<button
							type="button"
							onClick={onClose}
							className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
						>
							Create Ticket
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
