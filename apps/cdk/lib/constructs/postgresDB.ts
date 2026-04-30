import { aws_docdb } from "aws-cdk-lib";
import type * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface PostgresDBProps {
	instanceIdentifier: string;
	databaseName: string;
	instanceType: ec2.InstanceType;
	maxAllocatedStorage: number;
	deleteProtection: boolean;

	vpc: ec2.IVpc;
	subnets: ec2.ISubnet[];
}

export class PostgresDB extends Construct {
	readonly dbCredentialsSecret: secretsmanager.Secret;
	readonly dbInstance: rds.DatabaseInstance;

	constructor(scope: Construct, id: string, props: PostgresDBProps) {
		super(scope, id);

		this.dbCredentialsSecret = new secretsmanager.Secret(
			this,
			`DBCredentialsSecret`,
			{
				secretName: `${props.instanceIdentifier}-db-credentials`,
				generateSecretString: {
					secretStringTemplate: JSON.stringify({
						username: "postgres",
					}),
					excludePunctuation: true,
					includeSpace: false,
					generateStringKey: "password",
				},
			},
		);

		this.dbInstance = new rds.DatabaseInstance(this, "DBInstance", {
			instanceIdentifier: props.instanceIdentifier,
			databaseName: props.databaseName,
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_17_6,
			}),
			instanceType: props.instanceType,
			vpc: props.vpc,
			vpcSubnets: { subnets: props.subnets },
			maxAllocatedStorage: props.maxAllocatedStorage,
			credentials: rds.Credentials.fromSecret(this.dbCredentialsSecret),
			deletionProtection: props.deleteProtection,
			caCertificate: aws_docdb.CaCertificate.RDS_CA_RSA2048_G1,
		});
	}
}
