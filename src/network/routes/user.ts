import { FastifyInstance } from 'fastify';
import { firestore, storage } from '../../database/firebase';
import { UserRequest, UserResponse, $ref } from '../../schemas/schema';
import { BusboyConfig, BusboyFileStream } from '@fastify/busboy';
import UserService from '../../services/user';

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
  server.route({
    method: 'POST',
    url: '/user',
    schema: {
      body: $ref('userSchema'),
    },
    handler: UserService.createUser,
  });
  //endpoint to upload photos to the user folder
  server.route<{
    Params: { idFolder: string };
    Body: FilesRequest;
  }>({
    method: 'POST',
    url: '/user/:idFolder/upload',
    /* schema: {
      body: $ref('filesSchema'),
    }, */
    handler: async (request, reply) => {
      const { idFolder } = request.params;
      if (!idFolder) {
        reply.code(400).send({ error: 'idFolder is required' });
        return;
      }
      const [username, id] = idFolder.split('-');
      const user = (await firestore.doc(`users/${id}`).get()).data() as UserResponse | undefined;

      if (!user) {
        reply.code(404).send({ error: 'User not found' });
        return;
      }

      if (user.name !== username) {
        reply.code(409).send({ error: 'wrong user' });
        return;
      }

      const buff = request.body.image1;
      await storage.bucket().file(`${idFolder}/image1.jpg`).save(buff);

      /* Object.keys(files).forEach(async (key: string) => {
        const file: MultipartFile = files[key];
 */

      // upload files
      /* const files = await request.files();


      for await (const file of files) {
        const bufferFile = await file.toBuffer();
        console.log(bufferFile)
        await storage.bucket().file(`${idFolder}/${file.filename}`).save(bufferFile);
      } */
      /* const jsonFiles = request.body as FilesRequest;
      
      for (const file in jsonFiles) {
        const bufferFile = Buffer.from(jsonFiles[file as keyof typeof jsonFiles]).toString('utf-8');
        console.log(file)

      } */
      /* console.log(request.body) */
    },
  });
}
