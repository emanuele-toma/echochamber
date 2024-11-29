import { CONFIG } from '@/config';
import { AuthMiddleware } from '@/middlewares';
import { AuthRoutes, V1Routes } from '@/routes';
import type { Variables } from '@/types';
import { S3 } from '@/utils';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { Hono } from 'hono';
import mongoose from 'mongoose';

const main = async () => {
  console.log('🔧 Config');
  console.table(CONFIG);

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

  app.route('/auth', AuthRoutes);
  app.use('/api/*', AuthMiddleware);
  app.route('/api/v1', V1Routes);

  Bun.serve({
    ...app,
    port: CONFIG.PORT,
  });

  console.log(`🟢 Server is running on port ${CONFIG.PORT}`);
};

main();
