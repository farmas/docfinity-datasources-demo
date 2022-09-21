import { Body, Controller, Get, Post, Render } from '@nestjs/common';
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
    const result = this.datasourceService
      .getDatasources()
      .map((d) => new DatasourceViewModel(d));

    return result;
  }

  @Post()
  @Render('index')
  compareDatasoures(@Body() compareDTO: CompareRequest) {
    return { message: `${compareDTO.environment}: ${compareDTO.apiKey}` };
  }
}
