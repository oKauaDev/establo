import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import UserService from "../services/UserService";
import { UserType } from "../types/User";

const UserController = {
  create: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithEmail(req.body.email);

      if (user) {
        res.status(409).json({ error: "Já existe um usuário com esse e-mail" });
        return;
      }

      const newuser = await UserService.create(
        req.body.name,
        req.body.email.toLowerCase(),
        req.body.type,
      );

      if (!newuser) {
        res.status(500).json({ error: "Erro ao criar usuário" });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Usuário criado com sucesso",
        user: {
          id: newuser.id,
          name: newuser.name,
          email: newuser.email,
          type: newuser.type,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.params.id);

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      res.json({
        success: true,
        message: "Usuário encontrado com sucesso",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          type: user.type,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  edit: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.params.id);

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      let body: Partial<UserType> = {};

      if (req.body.name) body.name = req.body.name;
      if (req.body.email) body.email = req.body.email;
      if (req.body.type) body.type = req.body.type;

      const editUser = await UserService.edit(req.params.id, body);

      if (!editUser) {
        res.status(500).json({ error: "Erro ao editar usuário" });
        return;
      }

      res.json({
        success: true,
        message: "Usuário editado com sucesso",
        user: {
          id: editUser.id,
          name: editUser.name,
          email: editUser.email,
          type: editUser.type,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const user = await UserService.getWithId(req.params.id);

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      const deleted = await UserService.delete(req.params.id);

      if (!deleted) {
        res.status(500).json({ error: "Erro ao deletar usuário" });
        return;
      }

      res.json({
        success: true,
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const users = await UserService.all();

      if (!users) {
        res.status(500).json({ error: "Erro ao listar usuários" });
        return;
      }

      res.json({
        success: true,
        message: "Usuários listados com sucesso",
        users,
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },
};

export default UserController;
