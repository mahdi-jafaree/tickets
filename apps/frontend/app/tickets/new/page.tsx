"use client";

import type { CreateTicketInput } from "@tickets/backend";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { createTicket } from "../../../utils/actions/createTicket";
import { isError } from "../../../utils/isError";

export default function NewTicketPage() {
	const {
		handleSubmit: submit,
		register,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<CreateTicketInput>({
		defaultValues: { status: "open", priority: "medium" },
	});

	async function handleSubmit(data: CreateTicketInput) {
		const result = await createTicket(data);
		if (result && isError(result)) {
			setError("root", {
				message: result.error.message || "Failed to create ticket",
			});
		}
	}

	return (
		<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
			<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
					<span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						New Ticket
					</span>
					<Link
						href="/dashboard"
						className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						← Back to dashboard
					</Link>
				</div>
			</header>

			<main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
				<div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					<h1 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
						Create a ticket
					</h1>

					<form onSubmit={submit(handleSubmit)} className="flex flex-col gap-5">
						{errors.root?.message && (
							<p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
								{errors.root.message}
							</p>
						)}

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="title"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Title <span className="text-red-500">*</span>
							</label>
							<input
								id="title"
								type="text"
								placeholder="Short description of the issue"
								{...register("title", {
									required: "Title is required",
									maxLength: { value: 255, message: "Title is too long" },
								})}
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
							/>
							{errors.title?.message && (
								<p className="text-xs text-red-500">{errors.title.message}</p>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="description"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								id="description"
								rows={4}
								placeholder="Detailed description of the issue…"
								{...register("description", {
									required: "Description is required",
								})}
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
							/>
							{errors.description?.message && (
								<p className="text-xs text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="status"
									className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									Status <span className="text-red-500">*</span>
								</label>
								<select
									id="status"
									{...register("status", { required: "Status is required" })}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
								>
									<option value="open">Open</option>
									<option value="in_progress">In Progress</option>
									<option value="resolved">Resolved</option>
									<option value="closed">Closed</option>
								</select>
								{errors.status?.message && (
									<p className="text-xs text-red-500">
										{errors.status.message}
									</p>
								)}
							</div>

							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="priority"
									className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									Priority <span className="text-red-500">*</span>
								</label>
								<select
									id="priority"
									{...register("priority", {
										required: "Priority is required",
									})}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
								>
									<option value="low">Low</option>
									<option value="medium">Medium</option>
									<option value="high">High</option>
									<option value="critical">Critical</option>
								</select>
								{errors.priority?.message && (
									<p className="text-xs text-red-500">
										{errors.priority.message}
									</p>
								)}
							</div>
						</div>

						<div className="flex justify-end gap-3 pt-2">
							<Link
								href="/dashboard"
								className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={isSubmitting}
								className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60 dark:focus:ring-offset-zinc-900"
							>
								{isSubmitting ? "Creating…" : "Create Ticket"}
							</button>
						</div>
					</form>
				</div>
			</main>
		</div>
	);
}
