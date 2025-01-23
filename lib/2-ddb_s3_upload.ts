import { Construct } from 'constructs';
import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table, InputFormat } from 'aws-cdk-lib/aws-dynamodb'
import { BlockPublicAccess, Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';

export class DynamoDBS3SeedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the s3 bucket.
    const s3BucketUpload = new Bucket(this, 'SourceDataBucket', {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Upload the JSON data file to the s3 bucket.
    const bucketDeployment = new BucketDeployment(this, 'BucketDeployment', {
      sources: [Source.asset("./resources/seedData-s3/")],
      destinationBucket: s3BucketUpload
    });

    // Make sure the s3 bucket is created before the data file is uploaded.
    bucketDeployment.node.addDependency(s3BucketUpload);

    // Create the DDB Table.
    const customerTable = new Table(this, 'CustomerTable', {
        partitionKey: { name: 'id', type: AttributeType.STRING },
        tableName: 'Customers',
        importSource: {
          inputFormat: InputFormat.dynamoDBJson(),
          bucket: s3BucketUpload
        },
        pointInTimeRecovery: false
        });

    // Make sure the json data file is uploaded before the DDB table.
    customerTable.node.addDependency(bucketDeployment);
    };
};
