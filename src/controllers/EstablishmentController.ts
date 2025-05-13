import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import UserService from "../services/UserService";
import EstablishmentService from "../services/EstablishmentService";
import { EstablishmentType } from "../types/Establishment";
import { z } from "zod";

const EstablishmentController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.body.ownerId);

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      if (user.type !== "owner") {
        res.status(403).json({ error: "O usuário precisa ser do tipo proprietário" });
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

  get: async (req: Request, res: Response) => {
    try {
      const establishment = await EstablishmentService.getWithId(req.params.id);

      if (!establishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      res.json({
        success: true,
        message: "Estabelecimento encontrado com sucesso",
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

  edit: async (req: Request, res: Response) => {
    try {
      const establishment = await EstablishmentService.getWithId(req.params.id);

      if (!establishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      let body: Partial<EstablishmentType> = {};

      if (req.body.name) body.name = req.body.name;
      if (req.body.email) body.ownerId = req.body.ownerId;
      if (req.body.type) body.type = req.body.type;

      const editEstablishment = await EstablishmentService.edit(req.params.id, body);

      if (!editEstablishment) {
        res.status(500).json({ error: "Erro ao editar usuário" });
        return;
      }

      res.json({
        success: true,
        message: "Estabelecimento editado com sucesso",
        establishment: {
          id: editEstablishment.id,
          name: editEstablishment.name,
          ownerId: editEstablishment.ownerId,
          type: editEstablishment.type,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const establishment = await EstablishmentService.getWithId(req.params.id);

      if (!establishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      const deleted = await EstablishmentService.delete(req.params.id);

      if (!deleted) {
        res.status(500).json({ error: "Erro ao deletar o estabelecimento" });
        return;
      }

      res.json({
        success: true,
        message: "Estabelecimento deletado com sucesso",
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  query: async (req: Request, res: Response) => {
    try {
      const querys = req.query;
      const name = querys.name ? querys.name.toString() : undefined;
      const type = querys.type ? querys.type.toString() : undefined;

      const zType = z.enum(["shopping", "local"]).optional().parse(type);

      if (!name && !type) {
        const establishments = await EstablishmentService.all();

        if (!establishments) {
          res.status(404).json({ error: "Nenhum estabelecimento encontrado" });
          return;
        }

        res.json({
          success: true,
          message: "Estabelecimentos encontrados com sucesso",
          establishments: establishments,
        });
      } else {
        const establishments = await EstablishmentService.filter({ name, type: zType });

        if (!establishments) {
          res.status(404).json({ error: "Nenhum estabelecimento encontrado" });
          return;
        }

        res.json({
          success: true,
          message: "Estabelecimentos encontrados com sucesso",
          establishments: establishments,
        });
      }
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },
};

export default EstablishmentController;
