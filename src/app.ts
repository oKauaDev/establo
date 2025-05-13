import express from "express";
import serverRoute from "./routes/server.route";

const app = express();

app.use(express.json());

const routes = [serverRoute];

routes.forEach(({ path, router }) => {
  app.use(path, router);
});

export default app;
