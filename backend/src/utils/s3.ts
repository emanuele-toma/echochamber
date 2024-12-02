import { CONFIG } from '@/config';
import { S3Client } from '@aws-sdk/client-s3';

export class S3 extends S3Client {
  private static instance: S3Client;

  public constructor() {
    if (!S3.instance) {
      super({
        region: CONFIG.S3_REGION,
        credentials: {
          accessKeyId: CONFIG.S3_ACCESS_KEY,
          secretAccessKey: CONFIG.S3_SECRET_KEY,
        },
        endpoint: CONFIG.S3_ENDPOINT,
        forcePathStyle: true,
      });
      S3.instance = this;
    }

    return S3.instance;
  }
}
