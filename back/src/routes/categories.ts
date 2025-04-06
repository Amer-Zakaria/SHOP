import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Category } from "../models/category.ts";
import { Product } from "../models/product.ts";
import mongoose from "mongoose";
import auth from "../middleware/auth.ts";

interface ICategory {
  id: number;
  name: string;
  nameAr?: string;
}

async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/categories",
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const categories = await Category.find();

      reply.status(200).send(categories);
    }
  );

  fastify.post(
    "/categories",
    {
      preHandler: auth,
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1 },
            nameAr: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const input = _request.body as ICategory;
      console.log(input);
      await Category.create(input);

      reply.status(201).send("Category added successfully");
    }
  );

  //   fastify.put(
  //     "/categories/:id",
  //     {
  //       schema: {
  //         body: {
  //           type: "object",
  //           required: ["name", "price"],
  //           properties: {
  //             name: { type: "string", minLength: 1 },
  //             price: { type: "number", minimum: 0 },
  //           },
  //         },
  //         params: {
  //           type: "object",
  //           required: ["id"],
  //           properties: {
  //             id: { type: "string" },
  //           },
  //         },
  //       },
  //     },
  //     async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  //       const { id } = _request.params as { id: string };
  //       const input = _request.body as ICategory;

  //       const category = await Category.findByIdAndUpdate(id, input, { new: true });

  //       if (category) {
  //         reply.status(200).send("Category updated successfully");
  //       } else {
  //         reply.status(404).send("Category not found");
  //       }
  //     }
  //   );

  fastify.delete(
    "/categories/:id",
    {
      preHandler: auth,
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const { id } = _request.params as { id: string };

      // Check if the category got products then prevent
      const product = await Product.findOne({
        category: new mongoose.Types.ObjectId(id),
      });
      if (product) return reply.status(400).send("Category has product(s) pro");

      const category = await Category.findByIdAndDelete(id);

      if (category) {
        reply.status(200).send("Category deleted successfully");
      } else {
        reply.status(404).send("Category not found");
      }
    }
  );
}

export default categoryRoutes;
