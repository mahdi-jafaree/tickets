import type {
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
} from "typeorm";
import { Account } from "../entities";

export class AccountRepository {
	private readonly repo: Repository<Account>;
	constructor(private readonly manager: EntityManager) {
		this.repo = this.manager.getRepository(Account);
	}

	async create(entity: {
		firstName: string;
		lastName: string;
		emailAddress: string;
		password: string;
	}) {
		const createdAcc = this.repo.create(entity);
		const savedAcc = this.manager.save(createdAcc);
		return savedAcc;
	}

	async findOneBy(where: FindOptionsWhere<Account>) {
		return this.repo.findOneBy(where);
	}

	async findOne(options: FindOneOptions<Account>) {
		return this.repo.findOne(options);
	}

	async find(options?: FindManyOptions<Account>) {
		return this.repo.find(options);
	}
}
