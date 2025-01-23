import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'

export class DynamoDBStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create the DDB Table.
        const customerTable = new Table(this, 'CustomerTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            tableName: 'Customers',
            pointInTimeRecovery: false
        });
    };
};
