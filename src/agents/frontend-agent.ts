import type { DSLProject } from '../dsl/dsl-schema';
import { FrontendGenerator } from '../generators/frontend-generator';

export class FrontendAgent {
  private readonly generator = new FrontendGenerator();

  async generateFrontend(dsl: DSLProject): Promise<string> {
    const pages = dsl.frontend.pages;
    const files: string[] = [];

    dsl.entities.forEach((entity) => {
      pages.forEach((page) => {
        files.push(this.generator.generatePage(entity, page));
      });
    });

    return files.join('\n');
  }
}
