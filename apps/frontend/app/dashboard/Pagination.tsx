"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
	page: number;
	totalPages: number;
	currentFilters: { status?: string; search?: string; priority?: string };
};

export default function Pagination({
	page,
	totalPages,
	currentFilters,
}: Props) {
	const pathname = usePathname();

	if (totalPages <= 1) return null;

	function buildPageUrl(p: number) {
		const params = new URLSearchParams();
		if (currentFilters.status) params.set("status", currentFilters.status);
		if (currentFilters.search) params.set("search", currentFilters.search);
		if (currentFilters.priority)
			params.set("priority", currentFilters.priority);
		params.set("page", String(p));
		return `${pathname}?${params.toString()}`;
	}

	return (
		<div className="mt-6 flex items-center justify-between">
			<p className="text-sm text-zinc-500 dark:text-zinc-400">
				Page {page} of {totalPages}
			</p>
			<div className="flex gap-2">
				{page > 1 && (
					<Link
						href={buildPageUrl(page - 1)}
						className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
					>
						Previous
					</Link>
				)}
				{page < totalPages && (
					<Link
						href={buildPageUrl(page + 1)}
						className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
					>
						Next
					</Link>
				)}
			</div>
		</div>
	);
}
