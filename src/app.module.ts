import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { ErrorFilter } from './shared/error.filter';
import { UsersModule } from './users/users.module';
import './config/env';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { loggerConfig } from './shared/logger';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {useNewUrlParser: true, useCreateIndex: true}),
    WinstonModule.forRoot(loggerConfig),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },  
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },  
  ],
})
export class AppModule {}
