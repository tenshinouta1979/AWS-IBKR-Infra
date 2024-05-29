import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class IBKRInfra extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //create vpc
        const vpc = new ec2.Vpc(this, 'MyVPC', {
            cidr: '10.0.0.0/16'
        });

        //create subnet
        const subnet = new ec2.Subnet(this, 'MySubnet', {
            vpcId: vpc.vpcId,
            cidrBlock: '10.0.1.0/24',
            availabilityZone: 'us-west-2a'
        });

        //create Security Groups
        const sg = new ec2.SecurityGroup(this, 'MySecurityGroup', {
            vpc,
            description: 'Security Group for EC2 instance',
            allowAllOutbound: true
        });

        //create IAM Roles
        const role = new iam.Role(this, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
        });

        //create VPC Flow Logs
        const flowLog = new ec2.CfnFlowLog(this, 'FlowLog', {
            resourceId: vpc.vpcId,
            resourceType: 'VPC',
            trafficType: 'ALL',
            logDestinationType: 's3',
            logDestination: 'arn:aws:s3:::mylogs'
        });

        //create AWS CloudTrail
        const trail = new cloudtrail.Trail(this, 'MyTrail', {
            bucket: new s3.Bucket(this, 'MyTrailBucket')
        });
    }
}
