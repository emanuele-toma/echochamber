import { CONFIG } from '@/config';
import { AuthRoutes, V1Routes } from '@/routes';
import type { Variables } from '@/types';
import { S3 } from '@/utils';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';

const main = async () => {
  console.log('🔧 Config');
  const config = Object.entries(CONFIG).map(([key, value]) => ({
    key,
    value: typeof value === 'string' ? value : JSON.stringify(value),
  }));
  console.table(config);

  console.log('🟡 Connecting to database...');
  await mongoose.connect(CONFIG.MONGO_URI).catch(err => {
    console.error(err);
    process.exit(1);
  });
  console.log('🟢 Connected to database');

  console.log('🟡 Connecting to S3...');
  const s3 = new S3();
  const command = new ListBucketsCommand({});
  await s3.send(command);

  console.log('🟢 Connected to S3');

  console.log('🟡 Starting server...');
  const app = new Hono<{ Variables: Variables }>();

  app.get('/', c =>
    c.text(`
    
  ▓█████  ▄████▄   ██░ ██  ▒█████   ▄████▄   ██░ ██  ▄▄▄       ███▄ ▄███▓ ▄▄▄▄   ▓█████  ██▀███  
  ▓█   ▀ ▒██▀ ▀█  ▓██░ ██▒▒██▒  ██▒▒██▀ ▀█  ▓██░ ██▒▒████▄    ▓██▒▀█▀ ██▒▓█████▄ ▓█   ▀ ▓██ ▒ ██▒
  ▒███   ▒▓█    ▄ ▒██▀▀██░▒██░  ██▒▒▓█    ▄ ▒██▀▀██░▒██  ▀█▄  ▓██    ▓██░▒██▒ ▄██▒███   ▓██ ░▄█ ▒
  ▒▓█  ▄ ▒▓▓▄ ▄██▒░▓█ ░██ ▒██   ██░▒▓▓▄ ▄██▒░▓█ ░██ ░██▄▄▄▄██ ▒██    ▒██ ▒██░█▀  ▒▓█  ▄ ▒██▀▀█▄  
  ░▒████▒▒ ▓███▀ ░░▓█▒░██▓░ ████▓▒░▒ ▓███▀ ░░▓█▒░██▓ ▓█   ▓██▒▒██▒   ░██▒░▓█  ▀█▓░▒████▒░██▓ ▒██▒
  ░░ ▒░ ░░ ░▒ ▒  ░ ▒ ░░▒░▒░ ▒░▒░▒░ ░ ░▒ ▒  ░ ▒ ░░▒░▒ ▒▒   ▓▒█░░ ▒░   ░  ░░▒▓███▀▒░░ ▒░ ░░ ▒▓ ░▒▓░
   ░ ░  ░  ░  ▒    ▒ ░▒░ ░  ░ ▒ ▒░   ░  ▒    ▒ ░▒░ ░  ▒   ▒▒ ░░  ░      ░▒░▒   ░  ░ ░  ░  ░▒ ░ ▒░
     ░   ░         ░  ░░ ░░ ░ ░ ▒  ░         ░  ░░ ░  ░   ▒   ░      ░    ░    ░    ░     ░░   ░ 
     ░  ░░ ░       ░  ░  ░    ░ ░  ░ ░       ░  ░  ░      ░  ░       ░    ░         ░  ░   ░     
         ░                         ░                                           ░                 
  `),
  );

  app.use(
    '*',
    cors({
      origin: CONFIG.CORS_ORIGIN,
    }),
  );

  app.route('/auth', AuthRoutes);
  app.route('/api/v1', V1Routes);

  Bun.serve({
    ...app,
    port: CONFIG.PORT,
  });

  console.log(`🟢 Server is running on port ${CONFIG.PORT}`);
};

main();
