import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { DatasourceViewModel } from 'src/models/datasourceViewModel';
import { DatasourceDefinition } from 'src/typings';
import { buildDatasources } from './datasourceCatalog';

@Injectable()
export class DatasourceService {
  public getDatasources(): DatasourceViewModel[] {
    const localDatasources = buildDatasources();
    return localDatasources.map(
      (local) => new DatasourceViewModel(local, null),
    );
  }

  public downloadDatasource(name: string): DatasourceViewModel {
    const local = buildDatasources().find((d) => d.name === name);
    const remote = this.getRemoteDatasource(local);
    local.sql = remote.sql;
    fs.writeFileSync(`./data/datasources/${name}.sql`, remote.sql);

    return new DatasourceViewModel(local, remote);
  }

  public compareDatasources(): DatasourceViewModel[] {
    const localDatasources = buildDatasources();
    return localDatasources.map((local) => {
      const remote: DatasourceDefinition = this.getRemoteDatasource(local);
      return new DatasourceViewModel(local, remote);
    });
  }

  private getRemoteDatasource(
    local: DatasourceDefinition,
  ): DatasourceDefinition {
    const serverJson = fs.readFileSync(
      `./data/server/${local.name}.raw.json`,
      'utf8',
    );

    const serverObj = JSON.parse(serverJson);
    const serverProperties: any[] = serverObj.properties;
    return {
      name: serverObj.name,
      datasourceType: serverObj.datasourceType,
      description: serverObj.description,
      sql: serverProperties.find((p) => p.name === 'sqlQuery').value[0],
      parameters: serverObj.parameters,
    };
  }
}
