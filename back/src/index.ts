import http from "node:http";
import Fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import { connect } from "mongoose";
import productRoutes from "./routes/products.ts";
import cors from "@fastify/cors";
import categoryRoutes from "./routes/categories.ts";

interface IProduct {
  name: string;
  price: number;
}

const start = async (): Promise<void> => {
  // DB
  await connect(process.env.DB_URI as string).then(() =>
    console.log(`\nConected to MongoDB ${process.env.DB_URI as string}`)
  );

  try {
    // Define the serverFactory function
    const serverFactory = (handler: http.RequestListener) => {
      const server = http.createServer((req, res) => {
        handler(req, res);
      });
      return server;
    };

    const fastify: FastifyInstance = Fastify({ serverFactory });

    fastify.setErrorHandler((e) => {
      console.error(e);
    });

    await fastify.register(cors, {
      origin: process.env.UI_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
    });

    fastify.get(
      "/",
      async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
        reply.status(200).send("yo");
      }
    );
    fastify.register(productRoutes);
    fastify.register(categoryRoutes);

    fastify.ready((err) => {
      if (err) {
        console.error("Error starting server:", err);
        process.exit(1);
      }
      const port = process.env.PORT || 3000;
      fastify.server.listen(port, () => {
        console.log(`HTTP server is alive at ${port}`);
      });
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`[IO] ${error}`);
    }
  }
};
const Server = { start };
export default Server;
