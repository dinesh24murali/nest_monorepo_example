import { IUserRepositoryMongo } from "./user-repository.interface";
import { UserEntity } from "./user.entity";
import { User } from "./user.schema";

export class UserRepository implements IUserRepositoryMongo {
  async findById(id: string, select?: string): Promise<UserEntity | null> {
    return User.findById(id, select);
  }

  async insertOne(data: any, options?: any) {
    const temp = new User(data);
    console.log(" WOW! ")
    await temp.save();
  }

  async findByEmail(
    email: string,
    select?: string
  ): Promise<UserEntity | null> {
    return User.findOne(
      {
        email,
      },
      select
    );
  }
}
