import type {
	EntityManager,
	FindManyOptions,
	FindOneOptions,
	FindOptionsWhere,
	Repository,
} from "typeorm";
import type { Account, TicketPriority, TicketStatus } from "../entities";
import { Ticket } from "../entities";

export class TicketRepository {
	private readonly repo: Repository<Ticket>;
	constructor(private readonly manager: EntityManager) {
		this.repo = this.manager.getRepository(Ticket);
	}

	async create(entity: {
		title: string;
		description: string;
		status: TicketStatus;
		priority: TicketPriority;
		assignedTo?: string | null;
	}) {
		const ticketData: Partial<Ticket> = {
			title: entity.title,
			description: entity.description,
			status: entity.status,
			priority: entity.priority,
		};

		if (entity.assignedTo) {
			ticketData.assignedTo = { id: entity.assignedTo } as Account;
		}

		const ticket = this.repo.create(ticketData);
		return await this.manager.save(ticket);
	}

	async findOneBy(where: FindOptionsWhere<Ticket>) {
		return this.repo.findOneBy(where);
	}

	async findOne(options: FindOneOptions<Ticket>) {
		return this.repo.findOne(options);
	}

	async find(options?: FindManyOptions<Ticket>) {
		return this.repo.findAndCount(options);
	}

	async update(id: string, data: Partial<Ticket>) {
		await this.repo.update(id, data);
		return this.findOne({
			where: { id },
			relations: ["assignedTo"],
		});
	}

	async softDelete(id: string) {
		return this.repo.softDelete(id);
	}
}
