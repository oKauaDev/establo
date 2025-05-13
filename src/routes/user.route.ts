import { Router } from "express";
import { z } from "zod";
import zodschema from "../middlewares/zodschema";
import UserController from "../controllers/UserController";

const router = Router();

// POST /user/create
const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  email: z.string().email("O email é inválido"),
  type: z.enum(["owner", "customer"]),
});

router.post("/create", zodschema(createUserSchema), UserController.create);

// GET /user/find/:id
router.get("/find/:id", UserController.get);

// PUT /user/edit/:id
const editUserSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  email: z.string().email("O email é inválido").optional(),
  type: z.enum(["owner", "customer"]).optional(),
});

router.put("/edit/:id", zodschema(editUserSchema), UserController.edit);

// DELETE /user/delete/:id
router.delete("/delete/:id", UserController.delete);

// GET /user/list
router.get("/list", UserController.list);

export default {
  path: "/user",
  router,
};
