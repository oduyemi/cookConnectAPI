declare module 'cloudinary' {
  export function config(options: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  }): void;

  export const uploader: {
    upload: (
      filePath: string,
      options: {
        folder: string;
        width: number;
        crop: string;
        public_id: string;
      }
    ) => Promise<{
      secure_url: string;
    }>;
  };
}
