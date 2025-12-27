import { secrets } from "./env.config";
import { DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";

const awsConfig: DynamoDBClientConfig = {
  region: secrets.AWS_REGION,
  credentials: {
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
  },
};

export const dynamoDBConfig: DynamoDBClientConfig = awsConfig;
