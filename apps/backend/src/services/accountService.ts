import bcrypt from "bcrypt";
import type { AccountRepository } from "../repositories/account.repository";
import type { RoleRepository } from "../repositories/role.repository";
import type { SafeAccount } from "../types";
import TicketError, { BrotherErrorTypes } from "../utils/error";

export class AccountService {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly roleRepository: RoleRepository,
	) {}

	async listAll(): Promise<SafeAccount[]> {
		const accounts = await this.accountRepository.find();
		return accounts.map((account) => ({
			id: account.id,
			firstName: account.firstName,
			lastName: account.lastName,
			emailAddress: account.emailAddress,
			roles: account.roles,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		}));
	}

	async createTechnician(data: {
		firstName: string;
		lastName: string;
		emailAddress: string;
		password: string;
	}): Promise<SafeAccount> {
		const { firstName, lastName, emailAddress, password } = data;

		const existingAccount = await this.accountRepository.findOneBy({
			emailAddress,
		});
		if (existingAccount) {
			throw new TicketError(
				BrotherErrorTypes.BAD_REQUEST,
				"Email already registered",
				"duplicate_email",
			);
		}

		const techRole = await this.roleRepository.findByName("Technician");
		if (!techRole) {
			throw new TicketError(
				BrotherErrorTypes.NOT_FOUND,
				"Technician role not found",
				"role_not_found",
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const account = await this.accountRepository.create({
			firstName,
			lastName,
			emailAddress,
			password: hashedPassword,
		});

		const accountRole = await this.accountRepository.assignRole(
			account.id,
			techRole.id,
		);

		return {
			id: account.id,
			firstName: account.firstName,
			lastName: account.lastName,
			emailAddress: account.emailAddress,
			roles: [{ ...accountRole, role: techRole }],
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		};
	}

	async retrieve(id: string): Promise<SafeAccount> {
		const account = await this.accountRepository.findOne({
			where: { id },
			relations: ["roles", "roles.role"],
		});

		if (!account) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"Invalid credentials",
				"unauthorized",
			);
		}

		return {
			id: account.id,
			firstName: account.firstName,
			lastName: account.lastName,
			emailAddress: account.emailAddress,
			roles: account.roles,
			createdAt: account.createdAt,
			updatedAt: account.updatedAt,
		};
	}
}
