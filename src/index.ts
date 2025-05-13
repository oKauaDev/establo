import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import app from "./app";
import ddb from "./aws/dynamodbClient";

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
