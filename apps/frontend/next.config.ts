import * as dotenv from "dotenv";
import type { NextConfig } from "next";

dotenv.config({ path: "../../.env" });
const nextConfig: NextConfig = {
	/* config options here */
	output: "standalone",
	logging: false,
};

export default nextConfig;
