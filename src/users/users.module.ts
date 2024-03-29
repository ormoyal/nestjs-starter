import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: userSchema}]),
    ],
    controllers: [
        UsersController
    ],
    providers: [
        UsersService
    ]
})
export class UsersModule {}
