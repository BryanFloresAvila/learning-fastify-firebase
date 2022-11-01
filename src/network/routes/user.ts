import { FastifyInstance } from 'fastify';
import { firestore, storage } from '../../database/firebase';
import { UserRequest } from './schema';
import { BusboyConfig } from '@fastify/busboy';
import { MultipartFile } from '@fastify/multipart';

declare module 'fastify' {
  interface FastifyRequest {
    files: (options?: Omit<BusboyConfig, 'headers'>) => AsyncIterableIterator<MultipartFile>;
  }
}

/* import pump from 'pump';  */ // to handle streams
export default async function userRoutes(server: FastifyInstance) {
  server.route<{
    Body: UserRequest;
  }>({
    method: 'POST',
    url: '/user',
    handler: async (request, reply) => {
      const { name, phone } = request.body;
      const userRef = firestore.collection('users').doc();
      const folderRef = storage.bucket().file(`${name}-${userRef.id}`);
      userRef.set({ name, phone, idFolder: folderRef.id });
      await folderRef.save(''); //create folder
      reply.send({ name, phone, idFolder: folderRef.id });
    },
  });
  //endpoint to upload photos to the user folder
  server.route<{
    Params: { idFolder: string };
  }>({
    method: 'POST',
    url: '/user/:idFolder/upload',
    handler: async (request, reply) => {
      const { idFolder } = request.params;
      const file = await request.files();
    },
  });
}
