import type { Ticket } from "@tickets/backend/src/entities";
import Link from "next/link";
import { backendApi } from "../../utils/backendHandler";
import { isError } from "../../utils/isError";
import NewTicketButton from "./NewTicketButton";
import Pagination from "./Pagination";
import TicketFilters from "./TicketFilters";
import {
	PRIORITY_LABEL,
	PRIORITY_STYLES,
	STATUS_LABEL,
	STATUS_STYLES,
	type TicketPriority,
	type TicketStatus,
} from "./ticketConstants";

const PAGE_SIZE = 20;

type SearchParams = {
	page?: string;
	status?: string;
	search?: string;
	priority?: string;
};

export default async function DashboardPage({
	searchParams,
}: {
	searchParams: Promise<SearchParams>;
}) {
	const { page: pageParam, status, search, priority } = await searchParams;
	const page = Math.max(1, Number(pageParam ?? "1"));
	const skip = (page - 1) * PAGE_SIZE;

	const result = await backendApi.listTickets({
		limit: String(PAGE_SIZE),
		skip: String(skip),
		status,
		search,
		priority,
	});

	const tickets: Ticket[] = isError(result) ? [] : result.data.tickets;
	const count: number = isError(result) ? 0 : result.data.count;
	const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));
	return (
		<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
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
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
							All Tickets
						</h1>
						<p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
							{count} tickets total
						</p>
					</div>
					<NewTicketButton />
				</div>

				<TicketFilters status={status} search={search} priority={priority} />

				{/* Ticket table */}
				<div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
					{tickets.length === 0 ? (
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
								{tickets.map((ticket) => (
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
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[ticket.status as TicketStatus] ?? ""}`}
												>
													{STATUS_LABEL[ticket.status as TicketStatus] ??
														ticket.status}
												</span>
												<span
													className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[ticket.priority as TicketPriority] ?? ""}`}
												>
													{PRIORITY_LABEL[ticket.priority as TicketPriority] ??
														ticket.priority}
												</span>
											</div>
										</td>
										<td className="hidden px-4 py-3.5 sm:table-cell">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[ticket.status as TicketStatus] ?? ""}`}
											>
												{STATUS_LABEL[ticket.status as TicketStatus] ??
													ticket.status}
											</span>
										</td>
										<td className="hidden px-4 py-3.5 md:table-cell">
											<span
												className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITY_STYLES[ticket.priority as TicketPriority] ?? ""}`}
											>
												{PRIORITY_LABEL[ticket.priority as TicketPriority] ??
													ticket.priority}
											</span>
										</td>
										<td className="hidden px-4 py-3.5 lg:table-cell">
											{ticket.assignedTo ? (
												<span className="text-sm text-zinc-700 dark:text-zinc-300">
													{ticket.assignedTo.firstName}{" "}
													{ticket.assignedTo.lastName}
												</span>
											) : (
												<span className="text-sm text-zinc-400 dark:text-zinc-500">
													Unassigned
												</span>
											)}
										</td>
										<td className="hidden px-4 py-3.5 text-sm text-zinc-500 dark:text-zinc-400 lg:table-cell">
											{new Date(ticket.createdAt).toLocaleDateString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>

				<Pagination
					page={page}
					totalPages={totalPages}
					currentFilters={{ status, search, priority }}
				/>
			</main>
		</div>
	);
}
