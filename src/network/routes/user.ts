import { FastifyInstance } from 'fastify';
import { firestore, storage } from '../../database/firebase';
import { UserRequest } from '../../schemas/schema';
import { BusboyConfig, BusboyFileStream } from '@fastify/busboy';
import User from '../../services/user';
import pump from 'pump';

// create a instance of User class
const user = new User();

interface UserData {
  phone: string;
  idFolder: string;
  name: string;
}

declare namespace fastifyMultipart {
  export interface MultipartFields {
    [fieldname: string]: Multipart | Multipart[] | undefined;
  }
  export type Multipart = MultipartFile | MultipartValue;
  export interface MultipartValue<T = unknown> {
    value: T;
    fieldname: string;
    mimetype: string;
    encoding: string;
    fieldnameTruncated: boolean;
    valueTruncated: boolean;
    fields: MultipartFields;
  }
  export interface MultipartFile {
    toBuffer: () => Promise<Buffer>;
    file: BusboyFileStream;
    fieldname: string;
    filename: string;
    encoding: string;
    mimetype: string;
    fields: MultipartFields;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    files: (options?: Omit<BusboyConfig, 'headers'>) => AsyncIterableIterator<fastifyMultipart.MultipartFile>;
  }
}

export default async function userRoutes(server: FastifyInstance) {
  server.route<{
    Body: UserRequest;
  }>({
    method: 'POST',
    url: '/user',
    handler: async (request, reply) => {
      const { name, phone } = request.body;
      const userRef = firestore.collection('users').doc();
      const userFolderId = `${name}-${userRef.id}`;
      /* const folderRef = storage.bucket().file(`${name}-${userRef.id}`); */

      await userRef.set({ name, phone, idFolder: userFolderId });
      /* await folderRef.save(''); //create folder */
      reply.send({ name, phone, idFolder: userFolderId });
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
      //idFolder?
      if (!idFolder) {
        reply.code(400).send({ error: 'idFolder is required' });
        return;
      }

      const [username, id] = idFolder.split('-');
      const user = (await firestore.doc(`users/${id}`).get()).data() as UserData | undefined;

      if (!user) {
        reply.code(404).send({ error: 'User not found' });
        return;
      }

      if (user.name !== username) {
        reply.code(409).send({ error: 'wrong user' });
        return;
      }

      // upload files
      const files = await request.files();
      for await (const file of files) {
        const bufferFile = await file.toBuffer();
        await storage.bucket().file(`${idFolder}/${file.filename}`).save(bufferFile);
      }
    },
  });
}
