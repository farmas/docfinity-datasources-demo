import { DatasourceDefinition } from './typings';
import { aedsDivisions } from './datasources/AEDS-Divisions';

export const datasources: DatasourceDefinition[] = [
  buildDatasourceDefinition(aedsDivisions),
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
