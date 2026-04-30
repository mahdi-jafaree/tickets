import type { EntityManager, Repository } from "typeorm";
import { Role, type RoleName } from "../entities";

export class RoleRepository {
	private readonly repo: Repository<Role>;

	constructor(private readonly manager: EntityManager) {
		this.repo = this.manager.getRepository(Role);
	}

	async findByName(name: RoleName) {
		return this.repo.findOneBy({ name });
	}
}
