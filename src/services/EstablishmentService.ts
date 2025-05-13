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
import { EstablishmentType } from "../types/Establishment";

const TABLE_NAME = "Establishment";

const EstablishmentService = {
  getWithId: async (id: string) => {
    try {
      const { Item } = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return Item;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  create: async (name: string, ownerId: string, type: string) => {
    const establishment: EstablishmentType = {
      id: uuid(),
      name,
      ownerId,
      type: type as "shopping" | "local",
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: establishment,
        })
      );
      return establishment as EstablishmentType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  edit: async (id: string, data: Partial<EstablishmentType>) => {
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

      return Attributes as EstablishmentType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default EstablishmentService;
