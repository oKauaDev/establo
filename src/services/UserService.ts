import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import ddb from "../aws/dynamodbClient";
import { v4 as uuid } from "uuid";
import {
  DeleteItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
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

  create: async (name: string, email: string, type: string) => {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        id: uuid(),
        name: name,
        email: email,
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

  edit: async (id: string, data: Partial<UserType>) => {
    try {
      const updateExpression = Object.keys(data)
        .map((key) => `#${key} = :${key}`)
        .join(", ");

      const expressionAttributeValues: { [key: string]: any } = {};
      const expressionAttributeNames: { [key: string]: string } = {};

      for (const [key, value] of Object.entries(data)) {
        expressionAttributeNames[`#${key}`] = key;
        if (typeof value === "string") {
          expressionAttributeValues[`:${key}`] = { S: value };
        } else if (typeof value === "number") {
          expressionAttributeValues[`:${key}`] = { N: String(value) };
        } else if (typeof value === "boolean") {
          expressionAttributeValues[`:${key}`] = { BOOL: value };
        }
      }

      const updateCommand = new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: {
          id: { S: id },
        },
        UpdateExpression: `SET ${updateExpression}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW",
      });

      const result = await ddb.send(updateCommand);

      return {
        id: result.Attributes?.id.S ?? "",
        name: result.Attributes?.name.S ?? "",
        email: result.Attributes?.email.S ?? "",
        type: result.Attributes?.type.S ?? "",
      } as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  delete: async (id: string) => {
    try {
      const deleteCommand = new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: {
          id: { S: id },
        },
      });

      const result = await ddb.send(deleteCommand);

      if (result.$metadata.httpStatusCode === 200) {
        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  all: async () => {
    try {
      const command = new ScanCommand({ TableName: TABLE_NAME });
      const { Items } = await ddb.send(command);

      const users = Items?.map((item) => ({
        id: item.id.S ?? "",
        name: item.name.S ?? "",
        email: item.email.S ?? "",
        type: item.type.S ?? "",
      }));

      return users as UserType[] | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default UserService;
