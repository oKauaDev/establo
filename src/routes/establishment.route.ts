import { Router } from "express";
import { z } from "zod";
import zodschema from "../middlewares/zodschema";
import EstablishmentController from "../controllers/EstablishmentController";

const router = Router();

// POST /establishment/create
const createEstablishmentSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do estabelecimento deve ter pelo menos 3 caracteres")
    .max(255, "O nome do estabelecimento deve ter no máximo 255 caracteres"),
  ownerId: z.string().uuid("O id do proprietário é inválido"),
  type: z.enum(["shopping", "local"]),
});

router.post("/create", zodschema(createEstablishmentSchema), EstablishmentController.create);

// GET /establishment/find/:id
router.get("/find/:id", EstablishmentController.get);

// PUT /establishment/edit/:id
const editEstablishmentSchema = z.object({
  name: z
    .string()
    .min(3, "O nome do estabelecimento deve ter pelo menos 3 caracteres")
    .max(255, "O nome do estabelecimento deve ter no máximo 255 caracteres")
    .optional(),
  ownerId: z.string().uuid("O id do proprietário é inválido").optional(),
  type: z.enum(["shopping", "local"]).optional(),
});

router.put("/edit/:id", zodschema(editEstablishmentSchema), EstablishmentController.edit);

export default {
  path: "/establishment",
  router,
};
