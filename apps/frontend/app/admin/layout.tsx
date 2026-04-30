import type { SafeAccount } from "@tickets/backend";
import { redirect } from "next/navigation";
import { backendCaller } from "../../utils/backendHandler";
import { isError } from "../../utils/isError";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const result = await backendCaller<
		Record<never, never>,
		{ session: { account: SafeAccount } }
	>("auth/session", "GET");

	if (isError(result)) {
		redirect("/login");
	}

	const isAdmin = result.data.session.account.roles.some(
		(r) => r.role?.name === "Admin",
	);

	if (!isAdmin) {
		redirect("/dashboard");
	}

	return <>{children}</>;
}
