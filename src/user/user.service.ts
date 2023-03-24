import { Injectable } from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {sign} from 'jsonwebtoken'

import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {    
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto)
    
    return await this.userRepository.save(newUser)
  }

  generateJWT(user: UserEntity): string {
    return sign({id: user.id, username: user.username, email: user.email}, 'SECRET_KEY')
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.generateJWT(user)
      }
    }
  }
}