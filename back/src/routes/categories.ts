import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Category } from "../models/category.ts";
import { Product } from "../models/product.ts";

interface ICategory {
  id: number;
  name: string;
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
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const input = _request.body as ICategory;

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
      const products = await Product.find({ where: { category: id } });
      if (products?.length >= 1)
        reply.status(400).send("Category has product(s) pro");

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
