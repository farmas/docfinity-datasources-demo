import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatasourceService } from './services/datasourceService';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const datasourceService = app.get(DatasourceService);
  const results = datasourceService.compareDatasources();

  const errors = results.filter((d) => !!d.diff);
  if (errors.length === 0) {
    console.log('All datasources in remote equal to local versions.');
  } else {
    console.log(
      `Differences detected for datasource "${errors[0].local.name}":\n\n${errors[0].diff}`,
    );
    process.exit(1);
  }

  await app.close();
  process.exit(0);
}

bootstrap();
