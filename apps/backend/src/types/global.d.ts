import type { EntityManager } from "typeorm";
import type { SafeAccount } from "./account";

declare global {
	namespace Express {
		interface Request {
			manager: EntityManager;
			session: { account: SafeAccount };
		}
	}
}
