import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

export class CompareRequest {
  apiKey: string;
  environment: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'FOO!' };
  }

  @Get('/api/datasources')
  getDatasoures() {
    return { message: 'hola!' };
  }

  @Post()
  @Render('index')
  compareDatasoures(@Body() compareDTO: CompareRequest) {
    return { message: `${compareDTO.environment}: ${compareDTO.apiKey}` };
  }
}
