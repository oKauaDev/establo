import { Router } from "express";
import { z } from "zod";
import ProductController from "../controllers/ProductController";
import zodschema from "../middlewares/zodschema";

const router = Router();

// POST /product/create
const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  establishmentId: z.string().uuid("O id do estabelecimento é inválido"),
  price: z.number().positive("O preço deve ser um número positivo"),
});

router.post("/create", zodschema(createProductSchema), ProductController.create);

// GET /product/find/:id
router.get("/find/:id", ProductController.get);

// PUT /product/edit/:id
const editProductSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .optional(),
  establishmentId: z.string().uuid("O id do estabelecimento é inválido").optional(),
  price: z.number().positive("O preço deve ser um número positivo").optional(),
});

router.put("/edit/:id", zodschema(editProductSchema), ProductController.edit);

// DELETE /product/delete/:id
router.delete("/delete/:id", ProductController.delete);

// GET /product/list
router.get("/list", ProductController.list);

// GET /product/list/:establishment
router.get("/list/:establishment", ProductController.listOfEstablishment);

export default {
  path: "/product",
  router,
};
