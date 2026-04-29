import { DataSource } from "typeorm";
import { DB_CONFIG } from "../utils/configs";

const dataSource = new DataSource(DB_CONFIG);

export const getDBSource = async () => {
	return dataSource.isInitialized ? dataSource : dataSource.initialize();
};
