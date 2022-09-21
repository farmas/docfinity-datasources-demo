export interface DatasourceDefinition {
  id?: string;
  name: string;
  datasourceType: string;
  description: string;
  sql: string;
  parameters: DatasourceParameterDefinition[];
}

export interface DatasourceParameterDefinition {
  name: string;
  source: string;
  dataType: string;
  value: string;
}
