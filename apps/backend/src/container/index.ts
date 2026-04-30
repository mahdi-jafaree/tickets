import {
	type AwilixContainer,
	asClass,
	asValue,
	createContainer,
} from "awilix";
import type { EntityManager } from "typeorm";
import { AccountController } from "../controllers/accountController";
import { AuthController } from "../controllers/authController";
import { TicketController } from "../controllers/ticketController";
import { AccountRepository } from "../repositories/account.repository";
import { TicketRepository } from "../repositories/ticket.repository";
import { AccountService } from "../services/accountService";
import { AuthService } from "../services/auth";
import { TicketService } from "../services/ticket";

export interface Cradle {
	manager: EntityManager;
	accountRepository: AccountRepository;
	ticketRepository: TicketRepository;
	accountController: AccountController;
	authController: AuthController;
	ticketController: TicketController;
	authService: AuthService;
	accountService: AccountService;
	ticketService: TicketService;
}

export type AppContainer = AwilixContainer<Cradle>;

let container: AppContainer | null = null;

export function createAppContainer(manager: EntityManager): AppContainer {
	if (container) {
		return container;
	}

	container = createContainer<Cradle>({
		strict: true,
		injectionMode: "CLASSIC",
	});

	container.register({
		manager: asValue(manager),

		accountRepository: asClass(AccountRepository).singleton(),
		ticketRepository: asClass(TicketRepository).singleton(),
		accountController: asClass(AccountController).singleton(),
		authController: asClass(AuthController).singleton(),
		ticketController: asClass(TicketController).singleton(),
		authService: asClass(AuthService).singleton(),
		accountService: asClass(AccountService).singleton(),
		ticketService: asClass(TicketService).singleton(),
	});

	return container;
}

export function getContainer(): AppContainer {
	if (!container) {
		throw new Error(
			"Container not initialized. Call createAppContainer first.",
		);
	}

	return container;
}
