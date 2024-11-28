import { CONFIG } from '@/config';
import { S3 } from '@aws-sdk/client-s3';

export class S3Client {
  private static instance: S3;

  public constructor() {
    if (!S3Client.instance) {
      S3Client.instance = new S3({
        credentials: {
          accessKeyId: CONFIG.S3_ACCESS_KEY,
          secretAccessKey: CONFIG.S3_SECRET_KEY,
        },
        endpoint: CONFIG.S3_ENDPOINT,
      });
    }

    return S3Client.instance;
  }
}
