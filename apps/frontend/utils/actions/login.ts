"use server";
import type { LoginInput } from "@tickets/backend";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { backendApi } from "../backendHandler";
import { isError } from "../isError";

export async function login(data: LoginInput) {
	const res = await backendApi.login(data);
	const cookieStore = await cookies();

	if (isError(res)) {
		return res;
	}
	cookieStore.set("session", res.data.token, {
		secure: process.env.NODE_ENV === "production",
		maxAge: 24 * 60 * 60,
		sameSite: "strict",
		httpOnly: true,
	});
	redirect("/dashboard");
}
