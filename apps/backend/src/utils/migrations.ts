import { DataSource } from "typeorm";
import { DB_CONFIG } from "./configs";

async function runMigrations(dataSource: DataSource) {
	console.log("Running migrations ...");
	const migrations = await dataSource.runMigrations();
	console.log(`${migrations.length} migrations run successfully`);
}

async function revertMigrations(dataSource: DataSource) {
	console.log("Running migrations ...");
	await dataSource.undoLastMigration();
	console.log(`Reverted last migration successfully`);
}
async function showMigrations(dataSource: DataSource) {
	console.log("Showing migrations ...");
	await dataSource.showMigrations();
}

const args = process.argv.slice(2);

const action = args[0];

async function run() {
	const dataSource = new DataSource(DB_CONFIG);
	await dataSource.initialize();
	try {
		switch (action) {
			case "show":
				await showMigrations(dataSource);
				break;
			case "run":
				await runMigrations(dataSource);
				break;

			case "revert":
				await revertMigrations(dataSource);
				break;

			default:
				console.log(
					'Invalid argument. Valid arguments are "show", "run", "revert"',
				);
				break;
		}
	} catch (error) {
		console.log("Failed to run migrations. error: ", error);
	} finally {
		dataSource.destroy();
	}
}

run();
