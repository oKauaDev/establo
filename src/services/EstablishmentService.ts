import {
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import ddb from "../aws/dynamodbClient";
import { v4 as uuid } from "uuid";
import { EstablishmentType } from "../types/Establishment";
import { TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import EstablishmentRulesService from "./EstablishmentRulesService";

const TABLE_NAME = "Establishment";

const EstablishmentService = {
  getWithId: async (id: string) => {
    try {
      const { Item } = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return Item as EstablishmentType | undefined;
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

    const rulesCommand = EstablishmentRulesService.getPutCommandCreate(establishment.id, 5, 5);

    try {
      await ddb.send(
        new TransactWriteItemsCommand({
          TransactItems: [
            {
              Put: {
                TableName: TABLE_NAME,
                Item: {
                  id: { S: establishment.id },
                  name: { S: establishment.name },
                  ownerId: { S: establishment.ownerId },
                  type: { S: establishment.type },
                },
              },
            },
            {
              Put: {
                TableName: rulesCommand.TableName,
                Item: {
                  id: { S: rulesCommand.Item.id.S },
                  establishmentId: { S: rulesCommand.Item.establishmentId.S },
                  picturesLimit: { N: rulesCommand.Item.picturesLimit.N },
                  videoLimit: { N: rulesCommand.Item.videoLimit.N },
                },
              },
            },
          ],
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
      return Items as EstablishmentType[] | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  filter: async (filters: Partial<{ name: string; type: EstablishmentType["type"] }>) => {
    const filterExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (filters.name) {
      filterExpressions.push("contains(#name, :name)");
      expressionAttributeValues[":name"] = filters.name;
      expressionAttributeNames["#name"] = "name";
    }

    if (filters.type) {
      filterExpressions.push("#type = :type");
      expressionAttributeValues[":type"] = filters.type;
      expressionAttributeNames["#type"] = "type";
    }

    const command = new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined,
      ExpressionAttributeValues:
        Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
      ExpressionAttributeNames:
        Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
    });

    try {
      const { Items } = await ddb.send(command);
      return Items as EstablishmentType[] | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },
};

export default EstablishmentService;
