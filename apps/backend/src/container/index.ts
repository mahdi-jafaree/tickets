import {
  type AwilixContainer,
  asClass,
  asValue,
  createContainer,
} from "awilix";
import type { EntityManager } from "typeorm";
import { AuthController } from "../controllers/authController";
import { AccountRepository } from "../repositories/account.repository";
import { AuthService } from "../services/auth";

export interface Cradle {
	manager: EntityManager;
	accountRepository: AccountRepository;
	authController: AuthController;
	authService: AuthService;


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
    authController: asClass(AuthController).singleton(),
    authService: asClass(AuthService).singleton(),

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
