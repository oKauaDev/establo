import "dotenv/config";
import "./utils/checkAndCreateTables";
import "./utils/verifyEnvs";

import express from "express";
import establishmentRoute from "./routes/establishment.route";
import productRoute from "./routes/product.route";
import serverRoute from "./routes/server.route";
import userRoute from "./routes/user.route";

const app = express();
app.use(express.json());

const routes = [serverRoute, userRoute, establishmentRoute, productRoute];

routes.forEach(({ path, router }) => {
  app.use(path, router);
});

export default app;
