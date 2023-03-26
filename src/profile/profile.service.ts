import {Injectable, HttpException, HttpStatus} from '@nestjs/common'
import { ProfileResponseInterface } from './types/profileResponse.interface';
import { ProfileType } from './types/profile.type';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/user.entity';
import { FollowEntity } from './follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>
  ) {}

  async getProfile(currentUserId: number, username: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: username
    })

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id
    })

    return {...user, following: !!follow}
  }

  async followProfile(currentUserId: number, username: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: username
    })

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === user.id) {
      throw new HttpException('Not allowed', HttpStatus.BAD_REQUEST)
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id
    })

    if (!follow) {
      const followToCreate = new FollowEntity()
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id

      await this.followRepository.save(followToCreate)

    }

    return {...user, following: true}
  }

  async unFollowProfile(currentUserId: number, username: string): Promise<ProfileType> {
    const user = await this.userRepository.findOne({
      username: username
    })

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
    }

    if (currentUserId === user.id) {
      throw new HttpException('Not allowed', HttpStatus.BAD_REQUEST)
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id
    })

    return {...user, following: false}
  }

  async buildProfileResponse(profile: ProfileType): Promise<ProfileResponseInterface> {
    delete profile.email

    return {profile}
  }
}