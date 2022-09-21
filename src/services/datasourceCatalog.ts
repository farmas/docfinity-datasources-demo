import * as fs from 'fs';
import { DatasourceDefinition } from '../typings';

export function buildDatasources(): DatasourceDefinition[] {
  const result: DatasourceDefinition[] = [];

  const json: string = fs.readFileSync(
    './data/datasources/AEDS: Divisions.json',
    'utf8',
  );
  const sql = fs.readFileSync('./data/datasources/AEDS: Divisions.sql', 'utf8');

  const dfDatasource = JSON.parse(json);
  result.push(buildDatasourceDefinition(dfDatasource, sql));

  return result;
}

function buildDatasourceDefinition(
  json: any,
  sql: string,
): DatasourceDefinition {
  return {
    name: json.name,
    datasourceType: json.datasourceType,
    description: json.description,
    sql: sql,
    parameters: json.parameters,
  };
}

/**
  const properties: any[] = json.properties;
    sql: properties.find((p) => p.name === 'sqlQuery').value[0],
 * 
 */
