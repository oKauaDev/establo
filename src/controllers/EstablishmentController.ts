import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import UserService from "../services/UserService";
import EstablishmentService from "../services/EstablishmentService";

const EstablishmentController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.body.ownerId);

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      if (user.type !== "owner") {
        res.status(400).json({ error: "O usuário precisa ser do tipo proprietário" });
        return;
      }

      const establishment = await EstablishmentService.create(
        req.body.name,
        req.body.ownerId,
        req.body.type
      );

      if (!establishment) {
        res.status(500).json({ error: "Erro ao criar estabelecimento" });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Estabelecimento criado com sucesso",
        establishment: {
          id: establishment.id,
          name: establishment.name,
          ownerId: establishment.ownerId,
          type: establishment.type,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },
};

export default EstablishmentController;
