import { Body, Controller, Get, Post } from '@nestjs/common';
import { DatasourceViewModel } from './models/datasourceViewModel';
import { DatasourceService } from './services/datasourceService';

export class CompareRequest {
  apiKey: string;
  environment: string;
}

@Controller()
export class AppController {
  constructor(private readonly datasourceService: DatasourceService) {}
  @Get('/api/datasources')
  getDatasoures(): DatasourceViewModel[] {
    return this.datasourceService.getDatasources();
  }

  @Post('/api/datasources/compare')
  compareDatasoures() {
    return this.datasourceService.compareDatasources();
  }

  // @Post()
  // @Render('index')
  // compareDatasoures(@Body() compareDTO: CompareRequest) {
  //   return { message: `${compareDTO.environment}: ${compareDTO.apiKey}` };
  // }
}
