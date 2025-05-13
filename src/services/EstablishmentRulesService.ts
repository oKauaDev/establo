import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddb from "../aws/dynamodbClient";
import { v4 as uuid } from "uuid";
import { EstablishmentRulesType } from "../types/EstablishmentRules";

const TABLE_NAME = "EstablishmentRules";

const EstablishmentRulesService = {
  getWithId: async (id: string) => {
    try {
      const { Item } = await ddb.send(
        new GetCommand({ TableName: TABLE_NAME, Key: { id } }),
      );
      return Item;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  getByEstablishment: async (id: string) => {
    try {
      const filterExpression = "#establishmentId = :establishmentId";
      const expressionAttributeValue = { ":establishmentId": id };
      const expressionAttributeName = { "#establishmentId": "establishmentId" };

      const { Items } = await ddb.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: filterExpression,
          ExpressionAttributeValues: expressionAttributeValue,
          ExpressionAttributeNames: expressionAttributeName,
        }),
      );

      return Items?.[0] as EstablishmentRulesType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  getPutCommandCreate: (
    establishmentId: string,
    picturesLimit: number,
    videoLimit: number,
  ) => {
    const establishmentrules: EstablishmentRulesType = {
      id: uuid(),
      establishmentId,
      picturesLimit: 5,
      videoLimit: 1,
    };

    return {
      TableName: TABLE_NAME,
      Item: {
        id: { S: establishmentrules.id },
        establishmentId: { S: establishmentrules.establishmentId },
        picturesLimit: { N: String(establishmentrules.picturesLimit) },
        videoLimit: { N: String(establishmentrules.videoLimit) },
      },
    };
  },

  edit: async (id: string, data: Partial<EstablishmentRulesType>) => {
    try {
      const updateExpression = Object.keys(data)
        .map((key) => `#${key} = :${key}`)
        .join(", ");

      const expressionAttributeValues = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [`:${k}`, v]),
      );

      const expressionAttributeNames = Object.fromEntries(
        Object.keys(data).map((k) => [`#${k}`, k]),
      );

      const { Attributes } = await ddb.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression: `SET ${updateExpression}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        }),
      );

      return Attributes as EstablishmentRulesType | undefined;
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
        }),
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
};

export default EstablishmentRulesService;
