import Fastify from 'fastify';
import { userSchemas } from './schemas/schema';
import userRoutes from './network/routes/user';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
const fastify = Fastify({ logger: true });


fastify.register(require('@fastify/multipart'),
                  { 
                    attachFieldsToBody: 'keyValues',
                    limits: { fields:3, files: 3 }
                  }
                );

for (const schema of userSchemas) {
  fastify.addSchema(schema);
} 

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
