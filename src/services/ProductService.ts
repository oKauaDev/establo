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
import { ProductType } from "../types/Product";

const TABLE_NAME = "Product";

const ProductService = {
  getWithId: async (id: string) => {
    try {
      const { Item } = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
      return Item as ProductType | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  create: async (name: string, price: number, establishmentId: string) => {
    const product: ProductType = {
      id: uuid(),
      name,
      price,
      establishmentId,
    };

    try {
      await ddb.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: product,
        })
      );
      return product;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  edit: async (id: string, data: Partial<ProductType>) => {
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

      return Attributes as ProductType | undefined;
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
      return Items as ProductType[] | undefined;
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
        })
      );

      return Items as ProductType[] | undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  },

  getCountByEstablishment: async (id: string) => {
    try {
      const filterExpression = "#establishmentId = :establishmentId";
      const expressionAttributeValue = { ":establishmentId": id };
      const expressionAttributeName = { "#establishmentId": "establishmentId" };

      const { Count } = await ddb.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: filterExpression,
          ExpressionAttributeValues: expressionAttributeValue,
          ExpressionAttributeNames: expressionAttributeName,
          Select: "COUNT",
        })
      );

      return Count ?? 0;
    } catch (error) {
      console.error(error);
      return 0;
    }
  },
};

export default ProductService;
