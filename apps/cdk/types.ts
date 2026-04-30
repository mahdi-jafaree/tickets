export type AppEnv = "prod" | "qa";

import type { StackProps } from "aws-cdk-lib";

export interface AppStackProps extends StackProps {
	appEnv: AppEnv;
}
