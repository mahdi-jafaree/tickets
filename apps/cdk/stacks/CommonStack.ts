import { Stack, type StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import type * as s3 from "aws-cdk-lib/aws-s3";
import type { Construct } from "constructs";

import { PostgresDB } from "../lib/constructs/postgresDB";
import type { AppEnv } from "../types";

export interface CommonStackProps extends StackProps {
	appEnv: AppEnv;
}

export class CommonStack extends Stack {
	readonly vpc: ec2.Vpc;
	readonly db: PostgresDB;
	readonly imagesBucket: s3.Bucket;
	readonly publicImagesBucket: s3.Bucket;
	readonly ecsCluster: ecs.Cluster;

	constructor(scope: Construct, id: string, props: CommonStackProps) {
		super(scope, id, props);

		const vpc = ec2.Vpc.fromLookup(this, "YOUR VPC ID", {
			vpcId: "<VpcId>",
		});

		const privateSubnets = ec2.Subnet.fromSubnetId(
			this,
			`TicketSubnet`,
			"Subnet id",
		);

		this.db = new PostgresDB(this, "PostgresDB", {
			instanceIdentifier: `brother-db-${props.appEnv}`,
			databaseName: "ticket", // your db name, default: ticket
			instanceType:
				props.appEnv === "prod"
					? ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM)
					: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
			maxAllocatedStorage: 100,
			deleteProtection: props.appEnv === "prod",
			vpc,
			subnets: [privateSubnets],
		});

		this.ecsCluster = new ecs.Cluster(this, "ECSCluster", {
			clusterName: `ticket-cluster-${props.appEnv}`,
			vpc,
			containerInsightsV2: ecs.ContainerInsights.ENABLED,
		});
	}
}
