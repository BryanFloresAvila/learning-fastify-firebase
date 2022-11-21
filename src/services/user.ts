import { FastifyRequest, FastifyReply } from 'fastify';
import { firestore, storage } from '../database/firebase';
import { UserRequest } from '../schemas/schema';

export default class UserServicess {
  static createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, phone } = request.body as UserRequest;
    const userRef = firestore.collection('users').doc();
    const userFolderId = `${name}-${userRef.id}`;
    await userRef.set({ name, phone, idFolder: userFolderId });
    reply.send({ name, phone, idFolder: userFolderId });
  };
}
