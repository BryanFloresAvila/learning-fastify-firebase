import { FastifyRequest, FastifyReply } from 'fastify';
import { firestore, storage } from '../database/firebase';
import { UserRequest } from '../schemas/schema';

type CustomRequest = FastifyRequest<{
  Body: UserRequest;
}>;

export default class User {
  private _name: string;
  private _phone: string;
  private _idFolder: string;
  constructor() {
    this._name = '';
    this._phone = '';
    this._idFolder = '';
  }
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }
  get phone(): string {
    return this._phone;
  }
  set phone(value: string) {
    this._phone = value;
  }
  get idFolder(): string {
    return this._idFolder;
  }
  set idFolder(value: string) {
    this._idFolder = value;
  }

  public createUser = async (request: CustomRequest, reply: FastifyReply) => {
    const { name, phone } = request.body;
    const userRef = firestore.collection('users').doc();
    const userFolderId = `${name}-${userRef.id}`;
    /* const folderRef = storage.bucket().file(`${name}-${userRef.id}`); */

    await userRef.set({ name, phone, idFolder: userFolderId });
    /* await folderRef.save(''); //create folder */
    reply.send({ name, phone, idFolder: userFolderId });
  };
}
