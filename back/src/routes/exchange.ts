import type { FastifyReply, FastifyRequest, FastifyInstance } from "fastify";
import auth from "../middleware/auth.ts";
import { Exchange } from "../models/exchange.ts";

export default async function exchangeRoutes(fastify: FastifyInstance) {
  fastify.put(
    "/exchange",
    {
      preHandler: auth,
      schema: {
        body: {
          type: "object",
          required: ["exchange"],
          properties: {
            exchange: { type: "number" },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const input = _request.body as { exchange: number };
      try {
        const exchange = await Exchange.updateOne({}, input, { upsert: true });

        if (exchange) {
          reply.status(200).send("Exchange updated successfully");
        } else {
          reply.status(404).send("Exchange not found");
        }
      } catch (e) {
        reply.status(400).send("Failed to update the exchange rate");
      }
    }
  );
}
