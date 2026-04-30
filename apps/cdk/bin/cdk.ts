import * as cdk from "aws-cdk-lib";
import { config } from "../lib/config";
import { CommonStack, MainStack } from "../lib/stacks";
import { LbStack } from "../lib/stacks/LbStack";
import type { AppEnv } from "../types";

const app = new cdk.App();

const env = config.env;
const envs: AppEnv[] = ["prod", "qa"];
for (const appEnv of envs) {
	const commonStack = new CommonStack(app, `ticket-common-${appEnv}`, {
		env,
		appEnv,
	});

	cdk.Tags.of(commonStack).add(
		"app:environment-name",
		`ticket-common-${appEnv}`,
	);

	const mainStack = new MainStack(app, `ticket-${appEnv}`, {
		appEnv,
		db: commonStack.db,
		ecsCluster: commonStack.ecsCluster,
		env,
		containerEnvironment: {
			BACKEND_URL: config.backendUrl,
			FRONTEND_URL: config.baseUrl[appEnv],
		},
	});
	cdk.Tags.of(mainStack).add("app:environment-name", `ticket-${appEnv}`);

	const lbStack = new LbStack(app, `ticket-lb-${appEnv}`, {
		env,
		appEnv,
		fargateService: mainStack.fargateService,
	});
	cdk.Tags.of(lbStack).add("app:environment-name", `ticket-lb-${appEnv}`);
}
