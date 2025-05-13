import { DeleteItemCommand, DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "us-east-2" });

async function clearDynamoDb(table: string) {
  try {
    const scanCommand = new ScanCommand({
      TableName: table,
    });

    const data = await client.send(scanCommand);

    if (data.Items) {
      for (const item of data.Items) {
        const deleteCommand = new DeleteItemCommand({
          TableName: table,
          Key: {
            id: item.id,
          },
        });

        await client.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

beforeAll(async () => {
  await clearDynamoDb("User");
});
