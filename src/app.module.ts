import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatasourceService } from './services/datasourceService';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [DatasourceService],
})
export class AppModule {}
