import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Product } from "../models/product.ts";
import auth from "../middleware/auth.ts";

interface IProduct {
  _id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
}

async function productRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/products",
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const products = await Product.find();

      reply.status(200).send(products);
    }
  );

  fastify.post(
    "/products",
    {
      preHandler: auth,
      schema: {
        body: {
          type: "object",
          required: ["name", "price", "subcategory"],
          properties: {
            name: { type: "string", minLength: 1 },
            nameAr: { type: "string" },
            imgUrl: { type: "string" },
            price: { type: "number", minimum: 0 },
            subcategory: { type: "string", minLength: 1 },
            subcategoryAr: { type: "string" },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const input = _request.body as IProduct;

      try {
        await Product.create(input);
      } catch (e) {
        reply.status(400).send("Duplicated name");
      }

      reply.status(201).send("Product added successfully");
    }
  );

  fastify.put(
    "/products/:id",
    {
      preHandler: auth,
      schema: {
        body: {
          type: "object",
          required: ["name", "price", "subcategory"],
          properties: {
            name: { type: "string", minLength: 1 },
            nameAr: { type: "string" },
            imgUrl: { type: "string" },
            price: { type: "number", minimum: 0 },
            subcategory: { type: "string", minLength: 1 },
            subcategoryAr: { type: "string" },
          },
        },
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
      const input = _request.body as IProduct;
      try {
        const product = await Product.findByIdAndUpdate(id, input, {
          new: true,
        });

        if (product) {
          reply.status(200).send("Product updated successfully");
        } else {
          reply.status(404).send("Product not found");
        }
      } catch (e) {
        reply.status(400).send(`${e?.message} or Duplicated name`);
      }
    }
  );

  fastify.delete(
    "/products/:id",
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

      const product = await Product.findByIdAndDelete(id);

      if (product) {
        reply.status(200).send("Product deleted successfully");
      } else {
        reply.status(404).send("Product not found");
      }
    }
  );
}

export default productRoutes;
