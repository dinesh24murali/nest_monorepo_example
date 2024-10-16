import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './app/shared/shared.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [SharedModule, ConfigModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
