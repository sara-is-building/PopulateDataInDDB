import * as cdk from 'aws-cdk-lib';
import { Constants } from '../lib/common/constant';
import { DynamoDBStack } from '../lib/1-ddb_cli_upload';
import { DynamoDBS3SeedStack } from '../lib/2-ddb_s3_upload';
import { DynamoDBInlineStack } from '../lib/3-ddb_inline_upload';

const app = new cdk.App();

const ddbStack = new DynamoDBStack(app, 'DDBStack', {
    env: {
        account: Constants.CDK_ACCOUNT,
        region: Constants.CDK_REGION
    }
});

// const ddbS3Stack = new DynamoDBS3SeedStack(app, 'DynamoDBS3SeedStack', {
//     env: {
//         account: Constants.CDK_ACCOUNT,
//         region: Constants.CDK_REGION
//     }
// });

// const ddbInlineStack = new DynamoDBInlineStack(app, 'DynamoDBInlineSeedStack', {
//     env: {
//         account: Constants.CDK_ACCOUNT,
//         region: Constants.CDK_REGION
//     }
// });
