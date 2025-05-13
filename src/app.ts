import "dotenv/config";
import express from "express";
import serverRoute from "./routes/server.route";
import userRoute from "./routes/user.route";
import establishmentRoute from "./routes/establishment.route";

const app = express();

app.use(express.json());

const routes = [serverRoute, userRoute, establishmentRoute];

routes.forEach(({ path, router }) => {
  app.use(path, router);
});

export default app;
