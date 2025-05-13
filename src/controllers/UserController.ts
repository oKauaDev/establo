import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import UserService from "../services/UserService";

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
        req.body.password,
        req.body.type
      );

      if (!newuser) {
        res.status(500).json({ error: "Erro ao criar usuário" });
        return;
      }

      res.json({
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
};

export default UserController;
