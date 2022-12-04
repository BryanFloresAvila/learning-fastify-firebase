import { BusboyConfig } from '@fastify/busboy';
import { MultipartFile } from '@fastify/multipart';
import { count } from 'console';
import { FastifyRequest, FastifyReply } from 'fastify';
import { firestore, storage } from '../database/firebase';
import { UserRequest, UserResponse } from '../schemas/schema';

declare module 'fastify' {
  interface FastifyRequest {
    files: (options?: Omit<BusboyConfig, 'headers'>) => AsyncIterableIterator<MultipartFile>;
  }
}


interface FastifyRequestExtended extends FastifyRequest {
  params: {
    idFolder: string;
  };
}



export default class UserServicess {
  static createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, phone } = request.body as UserRequest;
    const userRef = firestore.collection('users').doc();
    const userFolderId = `${name}-${userRef.id}`;
    await userRef.set({ name, phone, idFolder: userFolderId });
    reply.send({ name, phone, idFolder: userFolderId }).code(200);
  };
  static uploadPhotos = async (request: FastifyRequest, reply: FastifyReply) => {
    const { idFolder } = request.params as FastifyRequestExtended['params'];
    const files = await request.files();
    let countPhotos = 0;
    const whitelist = ['image/png', 'image/jpeg'];
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
    
    for await (const file of files){
      if (!whitelist.includes(file.mimetype)) {
        reply.code(400).send({ error: 'wrong mimetype' });
        return;
      }
      countPhotos++;
    } 
    console.log(countPhotos);
    if (countPhotos < 4 && countPhotos > 0) {
      reply.code(400).send({ error: 'wrong number of photos' });
      return;
    }



    // upload files
    for await (const file of files) {
      const bufferFile = await file.toBuffer();
      await storage.bucket().file(`${idFolder}/${file.filename}`).save(bufferFile);
    };
    
    reply.code(200).send({ message: 'success' });
  }
}
