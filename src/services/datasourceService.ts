import { Injectable } from '@nestjs/common';
import { DatasourceDefinition } from 'src/typings';
import { buildDatasources } from './datasourceCatalog';

@Injectable()
export class DatasourceService {
  private datasources: DatasourceDefinition[];

  constructor() {
    this.datasources = buildDatasources();
  }

  public getDatasources(): DatasourceDefinition[] {
    return this.datasources;
  }
}
