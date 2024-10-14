import { Injectable } from '@nestjs/common';

import { UserRepository } from '@ct-pod/dal';
import run from '@ct-pod/kafka-connect';
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  constructor(private readonly userRepository: UserRepository) {
  }
  async getHello(): Promise<string> {
    const temp = await this.userRepository.findByEmail("email@sfdsdfsdf.dd");
    console.log({
      temp,
    })
    return 'Hello World!';
  }
  async insert(): Promise<string> {
    const temp = await this.userRepository.insertOne({
      _id: randomUUID(),
      "name": "name",
      "phone": "phone",
      "email": "email111@maildrop.cc",
      "address": "address",
      dob: "2001-10-20",
      lastLoggedIn: "2002-10-20",
      "documentUrl": "dasdasdasd",
      "status": "status",
      walletBalance: 100,
      "currency": "INR",
    });
    console.log({
      temp,
    })
    return 'Successfully inserted';
  }
}
