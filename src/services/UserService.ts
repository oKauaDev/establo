import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import ddb from "../aws/dynamodbClient";
import { v4 as uuid } from "uuid";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { UserType } from "../types/User";

const TABLE_NAME = "User";

const UserService = {
  getWithId: async (id: string) => {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    try {
      const { Item } = await ddb.send(command);
      return Item as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  getWithEmail: async (email: string) => {
    const command = new QueryCommand({
      TableName: "User",
      IndexName: "EmailIndex", // GSI
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": { S: email },
      },
    });

    try {
      const { Items } = await ddb.send(command);
      return (Items?.[0] ?? undefined) as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  create: async (name: string, email: string, password: string, type: string) => {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: uuid(),
        name: name,
        email: email,
        password: password,
        type: type,
      },
    });

    try {
      await ddb.send(command);
      return command.input.Item as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default UserService;
