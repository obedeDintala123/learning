import Fastify from "fastify";
import testRoutes from "./routes/test.routes";

const fastify = Fastify({ logger: true });

fastify.register(testRoutes, { prefix: "/api" });

fastify.listen({ port: 3000 });
