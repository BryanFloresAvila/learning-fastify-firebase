import Fastify from 'fastify';
import userRoutes from './network/routes/user';
const fastify = Fastify({ logger: true });

fastify.register(require('fastify-multipart')); //register plugin to handle multipart/form-data
fastify.register(userRoutes); // register user routes

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
