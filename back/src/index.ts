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
import exchangeRoutes from "./routes/exchange.ts";
import makeServerStayAlive from "./startups/makeServerStayAlive.ts";

interface IProduct {
  name: string;
  price: number;
  nameAr?: string;
  imgUrl?: string;
}

const start = async (): Promise<void> => {
  // Cron to make the server stay alive
  makeServerStayAlive();

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

    fastify.setErrorHandler((error, request, reply) => {
      if (error.validation) {
        reply.status(400).send(error.message);
      } else {
        reply.send(error);
      }
    });

    await fastify.register(cors, {
      origin: true,
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
    fastify.register(exchangeRoutes);

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
