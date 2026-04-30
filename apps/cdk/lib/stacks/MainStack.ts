import { Stack, type StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as logs from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";
import * as path from "node:path";
import type { AppEnv } from "../../types";
import type { PostgresDB } from "../constructs/postgresDB";

const BACKEND_PORT = 4001;

const FRONTEND_PORT = 3000;

export interface MainStackProps extends StackProps {
	appEnv: AppEnv;
	db: PostgresDB;
	ecsCluster: ecs.Cluster;
	containerEnvironment: Record<string, string>;
}

export class MainStack extends Stack {
	readonly fargateService: ecs.FargateService;

	constructor(scope: Construct, id: string, props: MainStackProps) {
		super(scope, id, props);

		const { appEnv, db, ecsCluster, containerEnvironment } = props;
		const vpc = ecsCluster.vpc;
		const desiredCount = appEnv === "prod" ? 2 : 1;

		const taskDef = new ecs.FargateTaskDefinition(this, "TaskDef", {
			family: `ticket-${appEnv}`,
			cpu: 512,
			memoryLimitMiB: 1024,
		});

		const backend = taskDef.addContainer("backend", {
			image: ecs.ContainerImage.fromAsset(
				path.resolve(__dirname, "../../../../"),
				{
					file: "apps/backend/Dockerfile",
				},
			),
			portMappings: [{ containerPort: BACKEND_PORT }],
			environment: {
				...containerEnvironment,
				DB_HOST: db.dbInstance.dbInstanceEndpointAddress,
				DB_PORT: db.dbInstance.dbInstanceEndpointPort,
				DB_NAME: "ticket",
			},
			secrets: {
				DB_PASSWORD: ecs.Secret.fromSecretsManager(
					db.dbCredentialsSecret,
					"password",
				),
				DB_USERNAME: ecs.Secret.fromSecretsManager(
					db.dbCredentialsSecret,
					"username",
				),
			},
			logging: ecs.LogDrivers.awsLogs({
				streamPrefix: "backend",
				logRetention: logs.RetentionDays.ONE_YEAR,
			}),
		});

		db.dbCredentialsSecret.grantRead(taskDef.taskRole);

		const frontend = taskDef.addContainer("frontend", {
			image: ecs.ContainerImage.fromAsset(
				path.resolve(__dirname, "../../../../"),
				{
					file: "apps/frontend/Dockerfile",
				},
			),
			portMappings: [{ containerPort: FRONTEND_PORT }],
			environment: {
				...containerEnvironment,
				BACKEND_URL: `http://localhost:${BACKEND_PORT}`,
			},
			logging: ecs.LogDrivers.awsLogs({
				streamPrefix: "frontend",
				logRetention: logs.RetentionDays.ONE_YEAR,
			}),
		});

		frontend.addContainerDependencies({
			container: backend,
			condition: ecs.ContainerDependencyCondition.HEALTHY,
		});

		const serviceSg = new ec2.SecurityGroup(this, "ServiceSG", {
			vpc,
			description: "Ticket Fargate service — ALB ingress on frontend port only",
			allowAllOutbound: true,
		});

		this.fargateService = new ecs.FargateService(this, "Service", {
			cluster: ecsCluster,
			taskDefinition: taskDef,
			serviceName: `ticket-${appEnv}`,
			vpcSubnets: {
				subnets: [], // replace it with your own subnets
			},
			securityGroups: [serviceSg],
			circuitBreaker: { rollback: true },
			desiredCount,
			maxHealthyPercent: 200,
			minHealthyPercent: 100,
			capacityProviderStrategies:
				props.appEnv === "qa"
					? [{ capacityProvider: "FARGATE_SPOT", weight: 2 }]
					: [{ capacityProvider: "FARGATE", weight: 1 }],
		});

		db.dbInstance.connections.allowDefaultPortFrom(serviceSg);
	}
}
