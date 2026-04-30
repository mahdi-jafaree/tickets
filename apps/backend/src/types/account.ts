import type { Account, AccountRole } from "../entities";

export type SafeAccount = Omit<Account, "password" | "roles"> & {
	roles: AccountRoleType[];
};
export type AccountRoleType = Omit<AccountRole, "account">;
