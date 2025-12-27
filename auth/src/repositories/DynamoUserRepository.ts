import { IUser, IUserRepository } from "./interfaces/IUserRepository";
import { User } from "../domain/user.entity";
import { PutCommand, GetCommand, QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { secrets } from "../config/env.config";

export class DynamoUserRepository implements IUserRepository {
  private readonly tableName = secrets.AWS_DYNAMODB_TABLE_NAME;

  constructor(private readonly ddb: DynamoDBDocumentClient) {}

  async createUser(user: IUser): Promise<IUser> {
    await this.ddb.send(
      new PutCommand({
        TableName: this.tableName,
        Item: {
          userId: `USER#${user.userId}`,
          username: user.username,
          password: user.password,
        },
        ConditionExpression: "attribute_not_exists(userId)",
      })
    );
    // return Promise.resolve();
    user.username = `USER#${user.userId}`
    return user
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: {
          userId: id,
        },
      })
    );

    if (!result.Item) return null;

    return new User(result.Item.userId, result.Item.username, result.Item.password);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    console.log(username);
    const result = await this.ddb.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: "UsernameIndex", // The name you gave the GSI in the console/CDK
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": username,
        },
      })
    );

    if (!result.Items || result.Items.length === 0) return null;
    return new User(
      result.Items[0].userId,
      result.Items[0].username,
      result.Items[0].password
    );
  }
}
