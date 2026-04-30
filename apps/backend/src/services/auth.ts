import bcrypt from "bcrypt";
import type { AccountRepository } from "../repositories/account.repository";
import type { LoginResponse } from "../types";
import TicketError, { BrotherErrorTypes } from "../utils/error";
import { generateToken } from "../utils/jwt";

export class AuthService {
	constructor(private readonly accountRepository: AccountRepository) {}

	async login(data: {
		emailAddress: string;
		password: string;
	}): Promise<LoginResponse> {
		const { emailAddress, password } = data;

		const account = await this.accountRepository.findOne({
			where: { emailAddress },
			relations: ["roles", "roles.role"],
		});

		if (!account) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"Invalid credentials",
				"unauthorized",
			);
		}

		const isValidPassword = await bcrypt.compare(password, account.password);

		if (!isValidPassword) {
			throw new TicketError(
				BrotherErrorTypes.UNAUTHORIZED,
				"Invalid credentials",
				"unauthorized",
			);
		}

		const token = await generateToken({
			accountId: account.id,
			email: account.emailAddress,
		});

		return {
			token,
			account: {
				id: account.id,
				firstName: account.firstName,
				lastName: account.lastName,
				roles: account.roles,
				createdAt: account.createdAt,
				updatedAt: account.updatedAt,
				emailAddress: account.emailAddress,
			},
		};
	}

	async register(data: {
		firstName: string;
		lastName: string;
		emailAddress: string;
		password: string;
	}) {
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

		const hashedPassword = await bcrypt.hash(password, 10);

		const account = await this.accountRepository.create({
			firstName,
			lastName,
			emailAddress,
			password: hashedPassword,
		});

		const token = await generateToken({
			accountId: account.id,
			email: account.emailAddress,
		});

		return {
			token,
			account: {
				id: account.id,
				firstName: account.firstName,
				lastName: account.lastName,
				emailAddress: account.emailAddress,
			},
		};
	}
}
