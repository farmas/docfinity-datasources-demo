import { DatasourceDefinition } from './typings';
//import * as aeds from '../data/datasources/AEDS: Divisions.json';

export const datasources: DatasourceDefinition[] = [
  //buildDatasourceDefinition(aeds),
];

function buildDatasourceDefinition(json: any): DatasourceDefinition {
  const properties: any[] = json.properties;

  return {
    name: json.name,
    datasourceType: json.datasourceType,
    description: json.description,
    value: properties.find((p) => p.name === 'sqlQuery').value[0],
    parameters: json.parameters,
  };
}
