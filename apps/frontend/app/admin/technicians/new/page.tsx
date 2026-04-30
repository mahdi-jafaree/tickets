"use client";

import type { CreateTechnicianInput } from "@tickets/backend";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTechnician } from "../../../../utils/actions/createTechnician";
import { isError } from "../../../../utils/isError";

export default function NewTechnicianPage() {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const {
		handleSubmit: submit,
		register,
		reset,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<CreateTechnicianInput>();

	async function handleSubmit(data: CreateTechnicianInput) {
		setSuccessMessage(null);
		const result = await createTechnician(data);
		if (result && isError(result)) {
			setError("root", {
				message: result.error.message || "Failed to create technician",
			});
			return;
		}
		reset();
		setSuccessMessage(
			`Technician account created for ${result?.data?.emailAddress ?? "user"}.`,
		);
	}

	return (
		<div className="flex min-h-full flex-col bg-zinc-50 dark:bg-zinc-950">
			<header className="sticky top-0 z-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
				<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
					<span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
						Create Technician
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
						New Technician Account
					</h1>

					<form onSubmit={submit(handleSubmit)} className="flex flex-col gap-5">
						{errors.root?.message && (
							<p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
								{errors.root.message}
							</p>
						)}

						{successMessage && (
							<p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
								{successMessage}
							</p>
						)}

						<div className="flex gap-4">
							<div className="flex flex-1 flex-col gap-1.5">
								<label
									htmlFor="firstName"
									className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									First name
								</label>
								<input
									id="firstName"
									{...register("firstName", {
										required: "First name is required",
									})}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
									placeholder="Jane"
								/>
								{errors.firstName?.message && (
									<span className="text-xs text-red-500">
										{errors.firstName.message}
									</span>
								)}
							</div>

							<div className="flex flex-1 flex-col gap-1.5">
								<label
									htmlFor="lastName"
									className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									Last name
								</label>
								<input
									id="lastName"
									{...register("lastName", {
										required: "Last name is required",
									})}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
									placeholder="Doe"
								/>
								{errors.lastName?.message && (
									<span className="text-xs text-red-500">
										{errors.lastName.message}
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="emailAddress"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Email address
							</label>
							<input
								id="emailAddress"
								type="email"
								{...register("emailAddress", { required: "Email is required" })}
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
								placeholder="jane@example.com"
							/>
							{errors.emailAddress?.message && (
								<span className="text-xs text-red-500">
									{errors.emailAddress.message}
								</span>
							)}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="password"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Password
							</label>
							<input
								id="password"
								type="password"
								{...register("password", {
									required: "Password is required",
									minLength: {
										value: 8,
										message: "Password must be at least 8 characters",
									},
								})}
								className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
								placeholder="••••••••"
							/>
							{errors.password?.message && (
								<span className="text-xs text-red-500">
									{errors.password.message}
								</span>
							)}
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							className="mt-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isSubmitting ? "Creating…" : "Create Technician"}
						</button>
					</form>
				</div>
			</main>
		</div>
	);
}
