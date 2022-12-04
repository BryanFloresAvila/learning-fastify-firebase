import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { firestore, storage } from '../../database/firebase';
import { UserRequest, UserResponse, $ref } from '../../schemas/schema';
import { BusboyConfig, BusboyFileStream } from '@fastify/busboy';
import UserService from '../../services/user';


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
  server.route({
    method: 'POST',
    url: '/user/:idFolder/upload',
    handler: UserService.uploadPhotos,
  });
}
