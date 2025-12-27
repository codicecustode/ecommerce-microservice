import { secrets } from "./env.config";
import {
  DynamoDBClient,
  CreateTableCommand,
  DescribeTableCommand,
} from "@aws-sdk/client-dynamodb";

export async function ensureTablesExist(client: DynamoDBClient): Promise<void> {
  const tableName = secrets.AWS_DYNAMODB_TABLE_NAME;

  try {
    // Check if table exists
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    console.log(
      `[log:tableSetUp.config.ts] Table "${tableName}" already exists.`
    );
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      console.log(
        `[log:tableSetUp.config.ts] Creating table "${tableName}"...`
      );

      const command = new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [
          { AttributeName: "userId", AttributeType: "S" },
          { AttributeName: "username", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "userId", KeyType: "HASH" }, // Direct lookup by ID
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "UsernameIndex",
            KeySchema: [
              { AttributeName: "username", KeyType: "HASH" }, // Search by username
            ],
            Projection: { ProjectionType: "ALL" },
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
      });

      const result = await client.send(command);
      if (result.TableDescription?.TableStatus === "CREATING") {
        await new Promise((resolve) => setTimeout(resolve, 10000)); // wait 10sec for table set up and start using it
        console.log("[log:tableSetUp.config.ts] Table created successfully!");
      }
    } else {
      throw error;
    }
  }
}
