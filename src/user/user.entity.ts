import { hash } from 'bcrypt';
import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from 'typeorm'

@Entity({name: 'users'})
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string

  @Column({default: ''})
  bio: string

  @Column({default: ''})
  image: string

  @BeforeInsert() 
  async hashPassword() {
    this.password = await hash(this.password, 10)
  }
}