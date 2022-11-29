type bodyUploadFiles = {
  image1: import('@fastify/multipart').MultipartFile;
  image2: import('@fastify/multipart').MultipartFile;
  image3: import('@fastify/multipart').MultipartFile;
};

type FilesRequest = {
  image1: Buffer;
};
