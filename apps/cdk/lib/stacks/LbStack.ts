import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import type * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import type { Construct } from "constructs";

import type { AppEnv } from "../../types";

export interface LbStackProps extends StackProps {
	appEnv: AppEnv;
	fargateService: ecs.FargateService;
}

export class LbStack extends Stack {
	readonly loadBalancer: elbv2.ApplicationLoadBalancer;

	constructor(scope: Construct, id: string, props: LbStackProps) {
		super(scope, id, props);

		const { appEnv, fargateService } = props;
		const vpc = fargateService.cluster.vpc;

		const albSg = new ec2.SecurityGroup(this, "AlbSG", {
			vpc,
			description: "Frontend ALB — allows inbound HTTP/HTTPS from the internet",
			allowAllOutbound: true,
		});
		albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "HTTP");
		albSg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), "HTTPS");

		this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, "ALB", {
			loadBalancerName: `ticket-alb-${appEnv}`,
			vpc,
			internetFacing: true,
			vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
			securityGroup: albSg,
		});

		const listener = this.loadBalancer.addListener("HttpListener", {
			port: 80,
			open: false,
		});

		listener.addTargets("FrontendTarget", {
			targetGroupName: `ticket-frontend-${appEnv}`,
			port: 3000,
			protocol: elbv2.ApplicationProtocol.HTTP,
			targets: [
				fargateService.loadBalancerTarget({
					containerName: "frontend",
					containerPort: 3000,
				}),
			],
			healthCheck: {
				path: "/",
				interval: Duration.seconds(30),
				healthyThresholdCount: 2,
				unhealthyThresholdCount: 3,
			},
			deregistrationDelay: Duration.seconds(30),
		});

		fargateService.connections.allowFrom(albSg, ec2.Port.tcp(3000));
	}
}
