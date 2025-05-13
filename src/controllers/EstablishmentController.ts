import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import UserService from "../services/UserService";
import EstablishmentService from "../services/EstablishmentService";
import { EstablishmentType } from "../types/Establishment";
import { z } from "zod";
import EstablishmentRulesService from "../services/EstablishmentRulesService";
import { EstablishmentRulesType } from "../types/EstablishmentRules";

const EstablishmentController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.body.ownerId);

      if (!user) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      if (user.type !== "owner") {
        res
          .status(403)
          .json({
            error: "O estabelecimento precisa ser do tipo proprietário",
          });
        return;
      }

      const establishment = await EstablishmentService.create(
        req.body.name,
        req.body.ownerId,
        req.body.type,
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

      const editEstablishment = await EstablishmentService.edit(
        req.params.id,
        body,
      );

      if (!editEstablishment) {
        res.status(500).json({ error: "Erro ao editar estabelecimento" });
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

      const establishmentRules =
        await EstablishmentRulesService.getByEstablishment(establishment.id);

      if (establishmentRules) {
        await EstablishmentRulesService.delete(establishmentRules.id);
      }

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
        const establishments = await EstablishmentService.filter({
          name,
          type: zType,
        });

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

  rules: async (req: Request, res: Response) => {
    try {
      const establishment = await EstablishmentService.getWithId(req.params.id);

      if (!establishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      const establishmentRules =
        await EstablishmentRulesService.getByEstablishment(establishment.id);

      if (!establishmentRules) {
        res.status(404).json({ error: "Nenhuma regra encontrada" });
        return;
      }

      res.json({
        success: true,
        message: "Estabelecimento encontrado com sucesso",
        rules: {
          id: establishmentRules.id,
          establishmentId: establishmentRules.establishmentId,
          videoLimit: establishmentRules.videoLimit,
          picturesLimit: establishmentRules.picturesLimit,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  editRules: async (req: Request, res: Response) => {
    try {
      const establishment = await EstablishmentService.getWithId(req.params.id);

      if (!establishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      let body: Partial<EstablishmentRulesType> = {};

      if (req.body.picturesLimit) body.picturesLimit = req.body.picturesLimit;
      if (req.body.videoLimit) body.videoLimit = req.body.videoLimit;

      if (Object.keys(body).length === 0) {
        res.status(404).json({ error: "Nenhuma regra para ser editada" });
        return;
      }

      const actualRules = await EstablishmentRulesService.getByEstablishment(
        establishment.id,
      );

      if (!actualRules) {
        res.status(404).json({ error: "Nenhuma regra encontrada" });
        return;
      }

      const editEstablishmentRules = await EstablishmentRulesService.edit(
        req.params.id,
        body,
      );

      if (!editEstablishmentRules) {
        res
          .status(500)
          .json({ error: "Erro ao editar as regras do estabelecimento" });
        return;
      }

      res.json({
        success: true,
        message: "Regras do Estabelecimento editado com sucesso",
        rules: {
          id: editEstablishmentRules.id ?? actualRules.id,
          establishmentId:
            editEstablishmentRules.establishmentId ?? actualRules.id,
          videoLimit: editEstablishmentRules.videoLimit ?? actualRules.id,
          picturesLimit: editEstablishmentRules.picturesLimit ?? actualRules.id,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },
};

export default EstablishmentController;
