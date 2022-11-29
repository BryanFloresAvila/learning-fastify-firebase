import zod from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
const userSchema = zod.object({
  name: zod.string({
    required_error: 'name is required',
  }),
  phone: zod.string({
    required_error: 'phone is required',
  }),
});

const userResponseSchema = zod.object({
  name: zod.string(),
  phone: zod.string(),
  idFolder: zod.string(), // id of the folder in the storage
});

/* const fileSchema = zod.object({
  encoding: zod.string(),
  fieldname: zod.string(),
  filename: zod.string(),
  mimetype: zod.enum(['image/jpeg', 'image/png', 'image/jpg']),
}); */
/* const filesSchema = zod.object({
  image1: fileSchema,
  image2: fileSchema,
}); */

const filesSchema = zod.object({
  image1: zod.string(),
});

export type UserRequest = zod.infer<typeof userSchema>;
export type UserResponse = zod.infer<typeof userResponseSchema>;
//export type FilesRequest = zod.infer<typeof filesSchema>; // this isn't necessary

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
  userSchema,
  userResponseSchema,
  filesSchema,
});
