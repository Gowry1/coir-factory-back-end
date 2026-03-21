import { Cloudinary } from './cloudinary.config';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export const uploadToCloudinary = (
  file: Express.Multer.File,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    Cloudinary.uploader
      .upload_stream(
        { folder: 'products' },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            return reject(new Error(error.message));
          }

          if (!result) {
            return reject(
              new Error('Cloudinary upload failed: no result returned'),
            );
          }

          return resolve(result);
        },
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .end(file.buffer);
  });
};
