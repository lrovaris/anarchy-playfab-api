// Users.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from '../schemas/User.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto)
    return createdUser.save()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async findOneByAddress(address: string): Promise<User | null> {
    return this.userModel.findOne({ address }).exec()
  }
  async updateUserDeposits(
    address: string,
    deposits: Array<{ value: string; timeStamp: number }>
  ): Promise<User | null> {
    const user = await this.userModel
      .findOneAndUpdate(
        { address },
        { $set: { deposits } },
        { new: true } 
      )
      .exec()

    return user
  }
}
