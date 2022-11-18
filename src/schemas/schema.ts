import zod from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const userSchema = zod.object({
  name: zod.string(),
  phone: zod.string(),
});

const userResponseSchema = zod.object({
  name: zod.string(),
  phone: zod.string(),
  idFolder: zod.string(), // id of the folder in the storage
});

/* const userPhotoSchema = zod.object({
  photos:  */

export type UserRequest = zod.infer<typeof userSchema>;

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  userSchema,
  userResponseSchema,
});
