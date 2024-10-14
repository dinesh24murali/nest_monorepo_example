import { Module } from '@nestjs/common';

import { SharedService } from './shared.service';
import {
    UserRepository,
    DalService,
} from '@ct-pod/dal';

const DAL_MODELS = [
    UserRepository,
];

const dalService = {
    provide: DalService,
    useFactory: async () => {
      const service = new DalService();
      await service.connect(process.env.MONGO_DB_CONNECTION_URL);
      return service;
    },
  };

const PROVIDERS = [
    ...DAL_MODELS,
    dalService,
    SharedService,
];

@Module({
  providers: [...PROVIDERS],
  exports: [...PROVIDERS],
})
export class SharedModule {}
