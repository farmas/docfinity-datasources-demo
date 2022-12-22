import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatasourceViewModel } from '../models/datasourceViewModel';
import { DatasourceDefinition } from '../typings';
import { buildDatasources } from './datasourceCatalog';

const filterSerializer = function (params) {
  return 'filter=' + JSON.stringify(params);
};

@Injectable()
export class DatasourceService {
  private domain = 'uw.cloudtest.docfinity.com';
  private apiHeaders = {
    Authorization: '',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': 'edm-test',
    Cookie: 'XSRF-TOKEN=edm-test',
  };

  constructor() {
    const apiKey: string = fs.readFileSync(`./api.test.key`, 'utf-8');
    this.apiHeaders.Authorization = 'Bearer ' + apiKey;
  }

  public getLocalDatasources(): DatasourceViewModel[] {
    const localDatasources = buildDatasources();
    return localDatasources.map(
      (local) => new DatasourceViewModel(local, null),
    );
  }

  public async downloadRemoteDatasource(
    name: string,
  ): Promise<DatasourceViewModel> {
    const local = buildDatasources().find((d) => d.name === name);
    const remote = await this.getRemoteDatasource(local);
    local.sql = remote.sql;
    fs.writeFileSync(`./data/datasources/${name}.sql`, remote.sql);

    return new DatasourceViewModel(local, remote);
  }

  public async compareDatasources(): Promise<DatasourceViewModel[]> {
    const localDatasources = buildDatasources();
    return await Promise.all(
      localDatasources.map(async (local) => {
        const remote: DatasourceDefinition = await this.getRemoteDatasource(
          local,
        );
        return new DatasourceViewModel(local, remote);
      }),
    );
  }

  private async getRemoteDatasourceId(name: string): Promise<string> {
    const response = await axios({
      url: `https://${this.domain}/docfinity/webservices/rest/datasources`,
      method: 'GET',
      headers: this.apiHeaders,
      paramsSerializer: {
        serialize: filterSerializer,
      },
      params: {
        filters: [
          {
            field: 'name',
            operator: 'eq',
            value: encodeURIComponent(name),
          },
        ],
      },
    });

    return response?.data?.results?.length > 0
      ? response.data.results[0].id
      : null;
  }

  private async getRemoteDatasource(
    local: DatasourceDefinition,
  ): Promise<DatasourceDefinition> {
    const datasourceId = await this.getRemoteDatasourceId(local.name);

    const response = await axios({
      url: `https://${this.domain}/docfinity/webservices/rest/datasources/${datasourceId}`,
      method: 'GET',
      headers: this.apiHeaders,
    });

    const serverObj = response.data;
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
