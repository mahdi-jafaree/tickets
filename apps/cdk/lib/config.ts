import type { Environment } from "aws-cdk-lib";
import type { AppEnv } from "../types";

export const config = {
	env: {
		account: "123456789012",
		region: "us-east-1",
	} as Environment,

	backendUrl: "http://backend.internal",

	baseUrl: {
		prod: "https://tickets.example.com",
		qa: "https://tickets-qa.example.com",
	} as Record<AppEnv, string>,
};
