"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { STATUS_LABEL, type TicketStatus } from "./ticketConstants";

type Props = {
	status?: string;
	search?: string;
	priority?: string;
};

export default function TicketFilters({
	status: currentStatus,
	search: currentSearch,
	priority: currentPriority,
}: Props) {
	const router = useRouter();
	const pathname = usePathname();
	const [localSearch, setLocalSearch] = useState(currentSearch ?? "");
	const isUserTypingRef = useRef(false);

	// Sync local search when server re-renders with updated search param
	useEffect(() => {
		setLocalSearch(currentSearch ?? "");
	}, [currentSearch]);

	const buildUrl = useCallback(
		(overrides: {
			status?: string | null;
			search?: string | null;
			priority?: string | null;
		}) => {
			const params = new URLSearchParams();
			const status =
				overrides.status !== undefined ? overrides.status : currentStatus;
			const search =
				overrides.search !== undefined ? overrides.search : currentSearch;
			const priority =
				overrides.priority !== undefined ? overrides.priority : currentPriority;
			if (status) params.set("status", status);
			if (search) params.set("search", search);
			if (priority) params.set("priority", priority);
			const qs = params.toString();
			return qs ? `${pathname}?${qs}` : pathname;
		},
		[pathname, currentStatus, currentSearch, currentPriority],
	);

	// Debounce search input — only fires when user is typing
	useEffect(() => {
		if (!isUserTypingRef.current) return;
		const timer = setTimeout(() => {
			isUserTypingRef.current = false;
			router.replace(buildUrl({ search: localSearch || null }));
		}, 350);
		return () => clearTimeout(timer);
	}, [localSearch, buildUrl, router]);

	function toggleStatus(s: TicketStatus) {
		router.replace(buildUrl({ status: currentStatus === s ? null : s }));
	}

	function setParam(key: "status" | "priority", value: string | null) {
		router.replace(buildUrl({ [key]: value }));
	}

	return (
		<>
			{/* Status filter cards */}
			<div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
				{(["open", "in_progress", "resolved", "closed"] as TicketStatus[]).map(
					(s) => (
						<button
							key={s}
							type="button"
							onClick={() => toggleStatus(s)}
							className={`rounded-xl border px-4 py-3 text-left transition ${
								currentStatus === s
									? "border-indigo-500 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/20"
									: "border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
							}`}
						>
							<p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
								{STATUS_LABEL[s]}
							</p>
						</button>
					),
				)}
			</div>

			{/* Filter row */}
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
						value={localSearch}
						onChange={(e) => {
							isUserTypingRef.current = true;
							setLocalSearch(e.target.value);
						}}
						className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500"
					/>
				</div>
				<select
					value={currentStatus ?? "all"}
					onChange={(e) =>
						setParam("status", e.target.value === "all" ? null : e.target.value)
					}
					className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
				>
					<option value="all">All statuses</option>
					<option value="open">Open</option>
					<option value="in_progress">In Progress</option>
					<option value="resolved">Resolved</option>
					<option value="closed">Closed</option>
				</select>
				<select
					value={currentPriority ?? "all"}
					onChange={(e) =>
						setParam(
							"priority",
							e.target.value === "all" ? null : e.target.value,
						)
					}
					className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
				>
					<option value="all">All priorities</option>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
					<option value="critical">Critical</option>
				</select>
			</div>
		</>
	);
}
