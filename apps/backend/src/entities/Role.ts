import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export type RoleName = 'Admin' | 'Technician'

@Entity("role")
export class Role {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "varchar", length: 50 })
	name: RoleName;

	@CreateDateColumn({ name: "created_at", type: "timestamptz", default: () => "NOW()" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updated_at", type: "timestamptz", default: () => "NOW()" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
	deletedAt?: Date;
}
