import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //We set it before all others imports because we need our environment variables ready
    MongooseModule.forRoot( process.env.MONGO_URI ), //The best is defined the root in a environment variable
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
