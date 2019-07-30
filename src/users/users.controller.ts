import { Controller, Get, HttpCode, Post, Req, Res, Body, UsePipes, ValidationPipe, UseFilters } from '@nestjs/common';
import {Request} from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { ErrorFilter } from '../shared/error.filter';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService){}

  @Get()
  findAll(@Req() req: Request) {
    return this.usersService.findAll();
  }

  @Post()
  @HttpCode(200)
  // @UsePipes(new ValidationPipe({forbidUnknownValues: true}))
  @UsePipes(new ValidationPipe({validationError: {target: false}}))
  @UseFilters(ErrorFilter)
  create(@Body() user: CreateUserDto) {
    return this.usersService.create(user);
  }
}
