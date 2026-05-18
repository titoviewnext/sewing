import type { DSLProject } from '../dsl/dsl-schema';

export class QAAgent {
  async validate(code: string, dsl: DSLProject): Promise<{ passed: boolean; issues: string[] }> {
    const issues: string[] = [];

    dsl.entities.forEach((entity) => {
      if (!code.includes(entity.name)) {
        issues.push(`Missing entity reference in generated code: ${entity.name}`);
      }

      entity.fields.forEach((field) => {
        if (!code.includes(field.name)) {
          issues.push(`Missing field reference in generated code: ${entity.name}.${field.name}`);
        }
      });
    });

    return {
      passed: issues.length === 0,
      issues
    };
  }
}
