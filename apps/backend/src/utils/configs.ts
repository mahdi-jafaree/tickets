import * as dotenv from "dotenv";
import path from "path";
import type { DataSourceOptions } from "typeorm";

dotenv.config({ path: "../../.env" });

const migrationPath = path.join(__dirname, "../migrations/**/*.{ts,js}");
const entitiesPath = path.join(__dirname, "../entities/**/*.{ts,js}");

export const DB_CONFIG: DataSourceOptions = {
	type: "postgres",
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	logging: false,
	entities: [entitiesPath],
	subscribers: [],
	migrations: [migrationPath],
};
