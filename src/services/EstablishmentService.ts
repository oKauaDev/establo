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
};

export default EstablishmentService;
