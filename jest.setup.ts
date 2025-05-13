import { DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import ddb from "./src/aws/dynamodbClient";

async function clearDynamoDb(table: string) {
  try {
    const scanCommand = new ScanCommand({
      TableName: table,
    });

    const data = await ddb.send(scanCommand);

    if (data.Items) {
      for (const item of data.Items) {
        const deleteCommand = new DeleteItemCommand({
          TableName: table,
          Key: {
            id: item.id,
          },
        });

        await ddb.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

beforeAll(async () => {
  await clearDynamoDb("User");
  await clearDynamoDb("Establishment");
  await clearDynamoDb("Product");
  await clearDynamoDb("EstablishmentRules");
});
