import { IUserRepositoryMongo } from "./user-repository.interface";
import { UserEntity } from "./user.entity";
import { User } from "./user.schema";
import { randomUUID } from 'crypto';

export class UserRepository implements IUserRepositoryMongo {
  async findById(id: string, select?: string): Promise<UserEntity | null> {
    return User.findById(id, select);
  }

  async insertOne(data: any, options?: any): Promise<UserEntity | null> {
    const temp = new User(data);
    temp._id = randomUUID();
    await temp.save();
    const user = await this.findById(temp._id);
    return user;
  }

  async updateOneById(id: string, data?: any) {
    const temp = await User.findByIdAndUpdate(id, data);
  }

  async unsetOneById(id: string, data?: any) {
    const temp = await User.findByIdAndUpdate(id, data);
    User.findByIdAndUpdate(id, { $unset: ["refreshToken"] });
  }

  async findByEmail(
    email: string,
    select?: string,
  ): Promise<UserEntity | null> {
    return User.findOne(
      {
        email,
      },
      select,
    );
  }

  async findByPhone(
    phone: string,
    select?: string,
  ): Promise<UserEntity | null> {
    return User.findOne(
      {
        phone,
      },
      select,
    );
  }
}
