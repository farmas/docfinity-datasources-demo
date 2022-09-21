import * as diff from 'diff';
import { DatasourceDefinition } from 'src/typings';

export class DatasourceViewModel {
  public diff: any = null;
  constructor(
    public local: DatasourceDefinition,
    public remote: DatasourceDefinition,
  ) {
    if (local && remote && local.sql && local.sql !== remote.sql) {
      const patch = diff.createTwoFilesPatch(
        'sql',
        'sql',
        local.sql,
        remote.sql,
      );

      this.diff = patch;
    }
  }
}
