
export enum UserStatus {
    ACTIVE,
    INACTIVE,
    ACCESS_REMOVED,
}

export interface UserEntity {
  _id: string;
  name: string;
  dob: Date;
  phone: string;
  email: string;
  address: string;
  documentUrl: string;
  status: UserStatus;
  lastLoggedIn: Date;
  walletBalance: Number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDBModel = UserEntity;
