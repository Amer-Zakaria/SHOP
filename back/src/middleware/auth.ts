import type { FastifyReply, FastifyRequest } from "fastify";

export default async function auth(req: FastifyRequest, reply: FastifyReply) {
  if (!req.headers["x-auth-pass"]) {
    reply.status(400).send("Missing x-auth-pass");
    return;
  }

  if (req.headers["x-auth-pass"] !== process.env.PASS) {
    reply.status(400).send("Wrong Password");
    return;
  }
}
