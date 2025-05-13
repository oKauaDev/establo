import {
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddb from "../aws/dynamodbClient";
import { v4 as uuid } from "uuid";
import { UserType } from "../types/User";

const TABLE_NAME = "User";

const UserService = {
  getWithId: async (id: string) => {
    try {
      const { Item } = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return Item as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  getWithEmail: async (email: string) => {
    try {
      const { Items } = await ddb.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "EmailIndex",
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
        })
      );
      return (Items?.[0] ?? undefined) as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  create: async (name: string, email: string, type: string) => {
    const user: UserType = {
      id: uuid(),
      name,
      email,
      type: type as "owner" | "customer",
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: user,
        })
      );
      return user;
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

      const expressionAttributeValues = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [`:${k}`, v])
      );

      const expressionAttributeNames = Object.fromEntries(
        Object.keys(data).map((k) => [`#${k}`, k])
      );

      const { Attributes } = await ddb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression: `SET ${updateExpression}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        })
      );

      return Attributes as UserType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  delete: async (id: string) => {
    try {
      await ddb.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id },
        })
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  all: async () => {
    try {
      const { Items } = await ddb.send(new ScanCommand({ TableName: TABLE_NAME }));
      return Items as UserType[] | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default UserService;
