import { Request, Response } from "express";
import errorToString from "../utils/errorToString";
import { ProductType } from "../types/Product";
import ProductService from "../services/ProductService";
import EstablishmentService from "../services/EstablishmentService";
import EstablishmentRulesService from "../services/EstablishmentRulesService";

const ProductController = {
  create: async (req: Request, res: Response) => {
    try {
      const estabelishment = await EstablishmentService.getWithId(
        req.body.establishmentId,
      );

      if (!estabelishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      const estabelishmentRules =
        await EstablishmentRulesService.getByEstablishment(estabelishment.id);

      if (estabelishmentRules) {
        /**
         * Fiquei sem muitas ideias de como desenvolver esse sistema de regras,
         * Como não foi especificado, foi considerado 4 imagens e 1 video por produto.
         */

        const products = await ProductService.getCountByEstablishment(
          estabelishment.id,
        );

        const pictures = products * 4;
        const videos = products * 1;

        if (pictures > estabelishmentRules.picturesLimit) {
          res.status(403).json({ error: "Limite de imagens atingido" });
          return;
        }

        if (videos > estabelishmentRules.videoLimit) {
          res.status(403).json({ error: "Limite de videos atingido" });
          return;
        }
      }

      const newproduct = await ProductService.create(
        req.body.name,
        req.body.price,
        req.body.establishmentId,
      );

      if (!newproduct) {
        res.status(500).json({ error: "Erro ao criar produto" });
        return;
      }

      res.status(201).json({
        success: true,
        message: "Produto criado com sucesso",
        product: {
          id: newproduct.id,
          name: newproduct.name,
          price: newproduct.price,
          establishmentId: newproduct.establishmentId,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  get: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.getWithId(req.params.id);

      if (!product) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      res.json({
        success: true,
        message: "Produto encontrado com sucesso",
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          establishmentId: product.establishmentId,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  edit: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.getWithId(req.params.id);

      if (!product) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      let body: Partial<ProductType> = {};

      if (req.body.name) body.name = req.body.name;
      if (req.body.email) body.price = req.body.price;
      if (req.body.type) body.establishmentId = req.body.establishmentId;

      const editProduct = await ProductService.edit(req.params.id, body);

      if (!editProduct) {
        res.status(500).json({ error: "Erro ao editar produto" });
        return;
      }

      res.json({
        success: true,
        message: "Produto editado com sucesso",
        product: {
          id: editProduct.id,
          name: editProduct.name,
          price: editProduct.price,
          establishmentId: editProduct.establishmentId,
        },
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const product = await ProductService.getWithId(req.params.id);

      if (!product) {
        res.status(404).json({ error: "Produto não encontrado" });
        return;
      }

      const deleted = await ProductService.delete(req.params.id);

      if (!deleted) {
        res.status(500).json({ error: "Erro ao deletar produto" });
        return;
      }

      res.json({
        success: true,
        message: "Produto deletado com sucesso",
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  list: async (req: Request, res: Response) => {
    try {
      const products = await ProductService.all();

      if (!products) {
        res.status(500).json({ error: "Erro ao listar produtos" });
        return;
      }

      res.json({
        success: true,
        message: "Produtos listados com sucesso",
        products,
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },

  listOfEstablishment: async (req: Request, res: Response) => {
    try {
      const estabelishment = await EstablishmentService.getWithId(
        req.params.establishment as string,
      );

      if (!estabelishment) {
        res.status(404).json({ error: "Estabelecimento não encontrado" });
        return;
      }

      const products = await ProductService.getByEstablishment(
        req.params.establishment as string,
      );

      if (!products) {
        res.status(500).json({ error: "Erro ao listar produtos" });
        return;
      }

      res.json({
        success: true,
        message: "Produtos listados com sucesso",
        products,
      });
    } catch (error) {
      res.status(500).json({ error: errorToString(error) });
    }
  },
};

export default ProductController;
