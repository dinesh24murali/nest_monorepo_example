import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessTokenGuard } from './app/shared/guards/accessToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get()
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Get('user')
  async inserUser(): Promise<string> {
    return await this.appService.insert();
  }
}
