import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Account } from "./Account";
import { Role } from "./Role";

@Entity("account_role")
export class AccountRole {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "account_id" })
	account: Account;

	@ManyToOne(() => Role)
	@JoinColumn({ name: "role_id" })
	role: Role;

	@CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "NOW()" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "NOW()" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
	deletedAt?: Date;
}
