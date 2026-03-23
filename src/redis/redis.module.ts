import { Global, Module, Logger } from '@nestjs/common';
import { createClient } from 'redis';
import type { RedisClientType } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (): Promise<RedisClientType> => {
        const logger = new Logger('Redis');

        const client: RedisClientType = createClient({
          url: process.env.REDIS_URL ?? 'redis://localhost:6379',
          socket: {
            reconnectStrategy: (retries: number) => {
              if (retries > 10) {
                return false;
              }
              return Math.min(retries * 500, 3000);
            },
          },
        });

        client.on('error', (error: Error) => {
          logger.error(`Redis error: ${error.message}`);
        });

        client.on('connect', () => {
          logger.log('Redis connecting...');
        });

        client.on('ready', () => {
          logger.log('Redis connected');
        });

        client.on('reconnecting', () => {
          logger.warn('Redis reconnecting...');
        });

        client.on('end', () => {
          logger.warn('Redis connection closed');
        });

        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
