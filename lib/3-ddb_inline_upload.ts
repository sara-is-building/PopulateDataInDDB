import { Construct } from 'constructs';
import { Fn, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb'
import { AwsCustomResource, AwsCustomResourcePolicy, AwsSdkCall, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class DynamoDBInlineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        // Create the DDB Table.
        const customerTable = new Table(this, 'CustomerTable', {
            partitionKey: { name: 'id', type: AttributeType.STRING },
            tableName: 'Customers',
            pointInTimeRecovery: false
        });

        const initializeData: AwsSdkCall = {
            service: 'DynamoDB',
            action: 'batchWriteItem',
            physicalResourceId: PhysicalResourceId.of(customerTable + "_initialization"),
            parameters: {
                TableName: customerTable.tableName,
                RequestItems: {
                    "Customers": [
                        {
                            "PutRequest": {
                                "Item": {
                                    "id": { "S": "001" },
                                    "sk": { "S": "Employee#1" },
                                    "name": { "S": "John Doe" },
                                    "type": { "S": "COO" }
                                },
                            }
                        },
                        {
                            "PutRequest": {
                                "Item": {
                                    "id": { "S": "002" },
                                    "sk": { "S": "Employee#2" },
                                    "name": { "S": "Jane Doe" },
                                    "type": { "S": "CEO" }
                                },

                            }
                        }
                    ]
                }
            }
        };

        const tableInitializationResource = new AwsCustomResource(this, 'TableInitializationResource', {
            policy:
                AwsCustomResourcePolicy.fromStatements([
                    new PolicyStatement({
                        actions: ['dynamodb:BatchWriteItem',
                            'dynamodb:DescribeTable',
                            'dynamodb:Query',
                            'dynamodb:Scan',
                            'dynamodb:GetItem',
                            'dynamodb:PutItem',
                            'dynamodb:UpdateItem',
                            'dynamodb:DeleteItem'
                        ],
                        effect: Effect.ALLOW,
                        resources: [Fn.join(':', ['arn:aws:dynamodb', this.region, this.account, 'table/Customers'])],

                    })]),
            onCreate: initializeData,
            onUpdate: initializeData
        });

        tableInitializationResource.node.addDependency(customerTable);
    };
};
