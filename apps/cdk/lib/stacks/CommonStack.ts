import { Stack, type StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import type { Construct } from "constructs";
import type { AppEnv } from "../../types";
import { PostgresDB } from "../constructs/postgresDB";

export interface CommonStackProps extends StackProps {
	appEnv: AppEnv;
}

export class CommonStack extends Stack {
	readonly vpc: ec2.IVpc;
	readonly db: PostgresDB;
	readonly ecsCluster: ecs.Cluster;

	constructor(scope: Construct, id: string, props: CommonStackProps) {
		super(scope, id, props);

		this.vpc = ec2.Vpc.fromLookup(this, "VPC", {
			vpcId: "<mock-vpc-id>",
		});

		const privateSubnet = ec2.Subnet.fromSubnetId(
			this,
			"TicketSubnet",
			"<mock-subnet-id>",
		);

		this.db = new PostgresDB(this, "PostgresDB", {
			instanceIdentifier: `ticket-db-${props.appEnv}`,
			databaseName: "ticket",
			instanceType:
				props.appEnv === "prod"
					? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)
					: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
			maxAllocatedStorage: 100,
			deleteProtection: props.appEnv === "prod",
			vpc: this.vpc,
			subnets: [privateSubnet],
		});

		this.ecsCluster = new ecs.Cluster(this, "ECSCluster", {
			clusterName: `ticket-cluster-${props.appEnv}`,
			vpc: this.vpc,
			containerInsightsV2: ecs.ContainerInsights.ENABLED,
		});
	}
}
