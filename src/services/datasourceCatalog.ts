import * as fs from 'fs';
import { DatasourceDefinition } from '../typings';

export function buildDatasources(): DatasourceDefinition[] {
  return [
    buildDatasourceDefinition('AEDS: Divisions'),
    buildDatasourceDefinition('IND_Generic Record Retention Date'),
  ];
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

/**
  const properties: any[] = json.properties;
    sql: properties.find((p) => p.name === 'sqlQuery').value[0],
 * 
 */
