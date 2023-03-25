import {Controller, Post, Body, Get, Req, UsePipes, ValidationPipe, HttpException, HttpStatus} from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { ExpressRequestInterface } from '@app/types/express.request.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {    
    const user = await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const result = await this.userService.validateUser(loginUserDto)

    if (result) {
      const existingUser = await this.userService.findUserByEmail(loginUserDto);
      return this.userService.buildUserResponse(existingUser)
    } else {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('user')
  async currentUser(@Req() request: ExpressRequestInterface): Promise<UserResponseInterface> {
    return this.userService.buildUserResponse(request.user)
  }
}