import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { DatasourceViewModel } from 'src/models/datasourceViewModel';
import { DatasourceDefinition } from 'src/typings';
import { buildDatasources } from './datasourceCatalog';

@Injectable()
export class DatasourceService {
  private localDatasources: DatasourceDefinition[];

  constructor() {
    this.localDatasources = buildDatasources();
  }

  public getDatasources(): DatasourceViewModel[] {
    return this.localDatasources.map(
      (local) => new DatasourceViewModel(local, null),
    );
  }

  public compareDatasources(): DatasourceViewModel[] {
    return this.localDatasources.map((local) => {
      const serverJson = fs.readFileSync(
        `./data/server/${local.name}.raw.json`,
        'utf8',
      );

      const serverObj = JSON.parse(serverJson);
      const serverProperties: any[] = serverObj.properties;
      const server: DatasourceDefinition = {
        name: serverObj.name,
        datasourceType: serverObj.datasourceType,
        description: serverObj.description,
        sql: serverProperties.find((p) => p.name === 'sqlQuery').value[0],
        parameters: serverObj.parameters,
      };

      return new DatasourceViewModel(local, server);
    });
  }
}
