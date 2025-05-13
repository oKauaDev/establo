import { ListTablesCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import ddb from "../aws/dynamodbClient";

const tables = [
  {
    TableName: "EstablishmentRules",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: "Establishment",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: "Product",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: "User",
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [
      { AttributeName: "id", AttributeType: "S" },
      { AttributeName: "email", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "EmailIndex",
        KeySchema: [{ AttributeName: "email", KeyType: "HASH" }],
        Projection: { ProjectionType: "ALL" },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
  },
];

async function checkAndCreateTables() {
  try {
    const listTablesCommand = new ListTablesCommand({});
    const data = await ddb.send(listTablesCommand);

    const existingTables = data.TableNames || [];

    for (const table of tables) {
      if (!existingTables.includes(table.TableName)) {
        console.info(`Tabela ${table.TableName} não encontrada, criando...`);

        const createTableCommand = new CreateTableCommand(table as any);
        await ddb.send(createTableCommand);

        console.info(`Tabela ${table.TableName} criada com sucesso.`);
      }
    }
  } catch (error) {
    console.error("Erro ao verificar/criar tabelas:", error);
  }
}

checkAndCreateTables();
