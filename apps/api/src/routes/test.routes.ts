import type { FastifyInstance } from "fastify";

export default function testRoutes(fastify: FastifyInstance) {
  fastify.get("/health", async () => {
    return { message: "hello world" };
  });
}
