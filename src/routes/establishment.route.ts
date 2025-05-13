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

// DELETE /establishment/delete/:id
router.delete("/delete/:id", EstablishmentController.delete);

// GET /establishment/query
router.get("/query", EstablishmentController.query);

// GET /establishment/rules/:id
router.get("/rules/:id", EstablishmentController.rules);

// PUT /establishment/rules/:id/edit
const editRulesEstablishmentSchema = z.object({
  picturesLimit: z.number().positive("O limite de fotos deve ser um número positivo").optional(),
  videoLimit: z.number().positive("O limite de videos deve ser um número positivo").optional(),
});

router.put(
  "/rules/:id/edit",
  zodschema(editRulesEstablishmentSchema),
  EstablishmentController.editRules
);

export default {
  path: "/establishment",
  router,
};
