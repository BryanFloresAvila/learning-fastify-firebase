import Fastify from 'fastify';
import { userSchemas } from './schemas/schema';
import userRoutes from './network/routes/user';
import { MultipartFile, MultipartValue } from '@fastify/multipart';
import { request } from 'http';
const fastify = Fastify({ logger: true });

fastify.register(require('@fastify/multipart'), {
  attachFieldsToBody: 'keyValues',
  limits: {
    files: 3,
    fields: 3,
  },
  onFile,
});

interface MultipartFileExtended extends MultipartFile {
  value: Buffer;
}

async function onFile(part: MultipartFileExtended) {
  const buff = await part.toBuffer();
  part.value = buff;
}

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
