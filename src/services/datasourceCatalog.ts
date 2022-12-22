import * as fs from 'fs';
import { DatasourceDefinition } from '../typings';

export function buildDatasources(): DatasourceDefinition[] {
  return fs
    .readdirSync('./data/datasources')
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => fileName.substring(0, fileName.length - 5))
    .map((datasourceName) => buildDatasourceDefinition(datasourceName));
}

function buildDatasourceDefinition(name: string): DatasourceDefinition {
  const json: string = fs.readFileSync(
    `./data/datasources/${name}.json`,
    'utf8',
  );
  const sql = fs.readFileSync(`./data/datasources/${name}.sql`, 'utf8');
  const dfDatasource = JSON.parse(json);

  return {
    name: dfDatasource.name,
    datasourceType: dfDatasource.datasourceType,
    description: dfDatasource.description,
    sql: sql,
    parameters: dfDatasource.parameters,
  };
}
