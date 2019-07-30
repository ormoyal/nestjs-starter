import { Model } from 'mongoose';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly UserModel: Model<IUser>) {}

  async create(createCatDto: CreateUserDto): Promise<IUser> {

    const createdCat = new this.UserModel(createCatDto);
    // throw 'banana'
    // throw new BadRequestException('הבחור לא נמצא')

      return await createdCat.save();


  }

  async findAll(): Promise<IUser[]> {
    throw 'הבחור לא נמצא';
    return await this.UserModel.find().then();
  }
}
