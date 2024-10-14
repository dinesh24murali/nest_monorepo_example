import { UserEntity } from "./user.entity";

export interface IUserRepositoryMongo {
    insertOne(data: any, options?: any);
    findById(id: string, select?: string): Promise<UserEntity | null>;
    findByEmail(email: string, select?: string): Promise<UserEntity | null>;
}
