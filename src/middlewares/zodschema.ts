import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export default function zodschema(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const messages: string[] = [];
      result.error.issues.forEach((issue) => {
        messages.push(`${issue.path[0] ? `${issue.path[0]} ` : ""}${issue.message}`);
      });
      res.status(400).json({ error: messages.join(", ") });
      return;
    }

    req.body = result.data;
    next();
  };
}
