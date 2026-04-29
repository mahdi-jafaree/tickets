import { Account } from "../entities";

export type SafeAccount = Omit<Account,'password'>
