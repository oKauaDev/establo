import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let client: DynamoDBClient;

if (process.env.NODE_ENV === "development") {
  client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
    credentials: {
      accessKeyId: "fake",
      secretAccessKey: "fake",
    },
  });
} else {
  client = new DynamoDBClient({
    region: process.env.AWS_REGION,
  });
}

const ddb = DynamoDBDocumentClient.from(client);

export default ddb;
