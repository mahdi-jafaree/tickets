import type { SafeAccount } from "@tickets/backend";
import type { Ticket } from "@tickets/backend/src/entities";
import Link from "next/link";
import { notFound } from "next/navigation";
import { backendApi } from "../../../utils/backendHandler";
import { isError } from "../../../utils/isError";
import {
	PRIORITY_LABEL,
	PRIORITY_STYLES,
	STATUS_LABEL,
	STATUS_STYLES,
	type TicketPriority,
	type TicketStatus,
} from "../../dashboard/ticketConstants";
import UpdateTicketForm from "./UpdateTicketForm";

export default async function TicketDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const [ticketRes, accountsRes] = await Promise.all([
		backendApi.getTicketById(id),
		backendApi.listAccounts(),
	]);

	if (isError(ticketRes)) {
		notFound();
	}

	const ticket = ticketRes.data as Ticket;
	const accounts = isError(accountsRes)
		? []
		: (accountsRes.data as SafeAccount[]);

	const statusStyle =
		STATUS_STYLES[ticket.status as TicketStatus] ?? "bg-zinc-100 text-zinc-600";
	const priorityStyle =
		PRIORITY_STYLES[ticket.priority as TicketPriority] ??
		"bg-zinc-100 text-zinc-600";
	const statusLabel =
		STATUS_LABEL[ticket.status as TicketStatus] ?? ticket.status;
	const priorityLabel =
		PRIORITY_LABEL[ticket.priority as TicketPriority] ?? ticket.priority;

	return (
		<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
			<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
					<Link
						href="/dashboard"
						className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={2}
							aria-hidden="true"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back to dashboard
					</Link>
					<span className="text-zinc-300 dark:text-zinc-700">/</span>
					<span className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate max-w-xs">
						{ticket.title}
					</span>
				</div>
			</header>

			<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					{/* Main content */}
					<div className="lg:col-span-2 space-y-6">
						<div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
							<div className="mb-4 flex flex-wrap items-center gap-2">
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
								>
									{statusLabel}
								</span>
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyle}`}
								>
									{priorityLabel}
								</span>
							</div>

							<h1 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
								{ticket.title}
							</h1>

							<p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
								{ticket.description}
							</p>
						</div>

						<div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
							<h2 className="mb-4 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
								Details
							</h2>
							<dl className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<dt className="text-zinc-500 dark:text-zinc-400">Assignee</dt>
									<dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
										{ticket.assignedTo
											? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`
											: "Unassigned"}
									</dd>
								</div>
								<div>
									<dt className="text-zinc-500 dark:text-zinc-400">Created</dt>
									<dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
										{new Date(ticket.createdAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</dd>
								</div>
								<div>
									<dt className="text-zinc-500 dark:text-zinc-400">
										Last updated
									</dt>
									<dd className="mt-1 font-medium text-zinc-900 dark:text-zinc-100">
										{new Date(ticket.updatedAt).toLocaleDateString(undefined, {
											year: "numeric",
											month: "short",
											day: "numeric",
										})}
									</dd>
								</div>
								<div>
									<dt className="text-zinc-500 dark:text-zinc-400">ID</dt>
									<dd className="mt-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
										{ticket.id}
									</dd>
								</div>
							</dl>
						</div>
					</div>

					{/* Sidebar — update form */}
					<div className="lg:col-span-1">
						<div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
							<h2 className="mb-5 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
								Update Ticket
							</h2>
							<UpdateTicketForm ticket={ticket} accounts={accounts} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
