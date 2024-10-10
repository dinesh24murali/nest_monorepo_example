import { Injectable } from '@nestjs/common';
import run from '@ct-pod/kafka-connect';

@Injectable()
export class AppService {
  getHello(): string {
    run();
    return 'Hello World!';
  }
}
