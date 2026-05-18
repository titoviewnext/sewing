import type { DSLProject } from '../dsl/dsl-schema';
import { BackendGenerator } from '../generators/backend-generator';

export class BackendAgent {
  private readonly generator = new BackendGenerator();

  async generateBackend(dsl: DSLProject): Promise<string> {
    const files = dsl.entities.map((entity) => this.generator.generateCRUD(entity));
    return files.join('\n');
  }
}
