"use client";

import type { LoginInput } from "@tickets/backend";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { login } from "../../utils/actions/login";
import { isError } from "../../utils/isError";

export default function LoginPage() {
	const {
		handleSubmit: submit,
		register,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<LoginInput>();

	async function handleSubmit(data: LoginInput) {
		const result = await login(data);
		if (isError(result)) {
			setError("emailAddress", { message: "Invalid credentials" });
			setError("password", { message: "Invalid credentials" });
		}
	}

	return (
		<div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Sign in to your account
					</h1>
					<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
						>
							Register
						</Link>
					</p>
				</div>

				<div className="rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					<form onSubmit={submit(handleSubmit)} className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="email"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Email address
							</label>
							<div className="flex flex-col gap-2">
								<input
									type="email"
									{...register("emailAddress", { required: true })}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
									placeholder="you@example.com"
								/>
								{errors.emailAddress?.message && (
									<span className="text-red-400">
										{errors.emailAddress?.message}
									</span>
								)}
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
								>
									Password
								</label>
							</div>
							<div className="flex flex-col gap-2">
								<input
									type="password"
									{...register("password", { required: true })}
									className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
									placeholder="••••••••"
								/>
								{errors.password?.message && (
									<span className="text-red-400">
										{errors.password?.message}
									</span>
								)}
							</div>
						</div>

						<button
							disabled={isSubmitting}
							type="submit"
							className="mt-1 disabled:cursor-not-allowed disabled:opacity-15 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
						>
							Sign in
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
