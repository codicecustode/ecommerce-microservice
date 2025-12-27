import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import { dynamoDBConfig } from "./aws.config";

const dynamoClient = new DynamoDBClient(dynamoDBConfig);

export const ddb: DynamoDBDocumentClient = DynamoDBDocumentClient.from(
  dynamoClient,
  {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  }
);
