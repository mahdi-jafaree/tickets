"use client";

import type { RegisterInput } from "@tickets/backend";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { register } from "../../utils/actions/register";

export default function RegisterPage() {
	const {
		handleSubmit: submit,
		register: registerForm,
		getValues,

		formState: { isSubmitting, errors },
	} = useForm<RegisterInput & { confirmPassword: string }>();

	async function handleSubmit(data: RegisterInput) {
		const result = await register(data);
		if (result) {
			alert("Something went wrong");
		}
	}
	console.log(errors);
	return (
		<div className="flex min-h-full flex-col items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
			<div className="w-full max-w-sm">
				<div className="mb-8 text-center">
					<h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Create an account
					</h1>
					<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
						>
							Sign in
						</Link>
					</p>
				</div>

				<div className="rounded-2xl border border-zinc-200 bg-white px-8 py-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
					<form onSubmit={submit(handleSubmit)} className="flex flex-col gap-5">
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="name"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								First name
							</label>
							{
								<div className="flex flex-col gap-2">
									<input
										{...registerForm("firstName", { required: true })}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
										placeholder="Jane Doe"
									/>
									{errors.firstName?.message && (
										<span className="text-red-400">
											{errors.firstName.message}
										</span>
									)}
								</div>
							}
						</div>
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="name"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Last name
							</label>
							{
								<div className="flex flex-col gap-2">
									<input
										{...registerForm("lastName", { required: true })}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
										placeholder="Jane Doe"
									/>
									{errors.firstName?.message && (
										<span className="text-red-400">
											{errors.firstName.message}
										</span>
									)}
								</div>
							}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="email"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Email address
							</label>
							{
								<div className="flex flex-col gap-2">
									<input
										id="email"
										{...registerForm("emailAddress", { required: true })}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
										placeholder="you@example.com"
									/>

									{errors.emailAddress?.message && (
										<span className="text-red-400">
											{errors.emailAddress.message}
										</span>
									)}
								</div>
							}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="password"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Password
							</label>
							{
								<div className="flex flex-col gap-2">
									<input
										type="password"
										{...registerForm("password", {
											required: {
												value: true,
												message: "Password is required",
											},
										})}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
										placeholder="••••••••"
									/>
									{errors.password?.message && (
										<span className="text-red-400">
											{errors.password.message}
										</span>
									)}
								</div>
							}
						</div>

						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="confirmPassword"
								className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
							>
								Confirm password
							</label>
							{
								<div className="flex flex-col gap-2">
									<input
										type="password"
										{...registerForm("confirmPassword", {
											required: {
												value: true,
												message: "Confirm Password is required",
											},
											validate: (v) =>
												v === getValues("password") ||
												"Password does not match",
										})}
										className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 shadow-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
										placeholder="••••••••"
									/>
									{errors.confirmPassword?.message && (
										<span className="text-red-400">
											{errors.confirmPassword.message}
										</span>
									)}
								</div>
							}
						</div>

						<button
							disabled={isSubmitting}
							type="submit"
							className="mt-1 disabled:cursor-not-allowed disabled:opacity-35 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
						>
							Create account
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
