import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";

export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";

@Entity("ticket")
export class Ticket {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 255, nullable: false })
	title: string;

	@Column({ type: "text", nullable: false })
	description: string;

	@Column({ type: "varchar", length: 50, nullable: false })
	status: TicketStatus;

	@Column({ type: "varchar", length: 50, nullable: false })
	priority: TicketPriority;

	@ManyToOne(() => Account, { nullable: true })
	@JoinColumn({ name: "assigned_to" })
	assignedTo: Account | null;

	@CreateDateColumn({
		name: "created_at",
		type: "timestamptz",
		default: () => "NOW()",
	})
	createdAt: Date;

	@UpdateDateColumn({
		name: "updated_at",
		type: "timestamptz",
		default: () => "NOW()",
	})
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
	deletedAt?: Date;
}
