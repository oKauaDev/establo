import { Router } from "express";
import { z } from "zod";
import zodschema from "../middlewares/zodschema";
import UserController from "../controllers/UserController";

const router = Router();

const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  email: z.string().email("O email é inválido"),
  type: z.enum(["owner", "customer"]),
});

router.post("/create", zodschema(createUserSchema), UserController.create);

export default {
  path: "/user",
  router,
};
