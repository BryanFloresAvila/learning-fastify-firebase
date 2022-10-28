import { FastifyInstance } from 'fastify';
export default async function userRoutes(server: FastifyInstance) {
  server.route({
    method: 'GET',
    url: '/users',
    handler: async (request, reply) => {
      return { hello: 'world' };
    },
  });
}
