import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {sign} from 'jsonwebtoken'
import { compare } from 'bcrypt';

import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { config } from 'dotenv';

config();

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean | HttpException> {
    const userByEmail = await this.userRepository.findOne({
      email: loginUserDto.email
    }, {select: ['id', 'username', 'bio', 'image', 'email', 'password']})

    if (!userByEmail) {
      throw new HttpException('Email is not registered', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const isRightPassword = await compare(loginUserDto.password, userByEmail.password)
    
    if (!isRightPassword) {
      throw new HttpException('Incorrect password', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    return true
  }

  async findUserByEmail(loginUserDto: LoginUserDto): Promise<UserEntity> {
    return await this.userRepository.findOne({
      email: loginUserDto.email
    })
  }

  async findUserById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id)
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {    
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email
    })
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username
    })

    if (userByEmail || userByUsername) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto)
    
    return await this.userRepository.save(newUser)
  }

  generateJWT(user: UserEntity): string {
    return sign({id: user.id, username: user.username, email: user.email}, process.env.SECRET_KEY)
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }

  async updateUser(currentUserId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findUserById(currentUserId)
    Object.assign(user, updateUserDto)
    return await this.userRepository.save(user)
  }
}