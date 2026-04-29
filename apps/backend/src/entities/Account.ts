import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AccountRole } from "./AccountRole";

@Entity("account")
export class Account {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ name: "first_name", nullable: false })
	firstName: string;

	@Column({ name: "last_name", nullable: false })
	lastName: string;

	@Index({ unique: true })
	@Column({ name: "email_address", nullable: false, unique: true })
	emailAddress: string;

	@Column({ nullable: false })
	password: string;

	@OneToMany(
		() => AccountRole,
		(role) => role.account,
	)
	roles: AccountRole[];

	@CreateDateColumn({ name: "created_at", type: "timestamp", default: () => "NOW()" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamp", default: () => "NOW()" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "timestamp", nullable: true })
	deletedAt?: Date;
}
