import { Body, Controller, Get, Post } from '@nestjs/common';
import { DatasourceViewModel } from './models/datasourceViewModel';
import { DownloadRequestModel } from './models/downloadRequestModel';
import { DatasourceService } from './services/datasourceService';

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

  @Post('/api/datasources/download')
  downloadDatasoure(@Body() body: DownloadRequestModel) {
    return this.datasourceService.downloadDatasource(body.name);
  }
}
