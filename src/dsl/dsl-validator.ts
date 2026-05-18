import type { DSLProject } from './dsl-schema';

const VALID_FIELD_TYPES = new Set(['string', 'number', 'boolean', 'date', 'uuid']);

export function validateDSL(dsl: DSLProject): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!dsl.name || dsl.name.trim().length === 0) {
    errors.push('Project name is required.');
  }

  if (!Array.isArray(dsl.entities) || dsl.entities.length === 0) {
    errors.push('At least one entity is required.');
  }

  dsl.entities?.forEach((entity, entityIndex) => {
    if (!entity.name || entity.name.trim().length === 0) {
      errors.push(`Entity at index ${entityIndex} must have a name.`);
    }

    if (!Array.isArray(entity.fields) || entity.fields.length === 0) {
      errors.push(`Entity ${entity.name || entityIndex} must have at least one field.`);
      return;
    }

    entity.fields.forEach((field, fieldIndex) => {
      if (!field.name || field.name.trim().length === 0) {
        errors.push(`Field at index ${fieldIndex} in entity ${entity.name || entityIndex} must have a name.`);
      }

      if (!VALID_FIELD_TYPES.has(field.type)) {
        errors.push(`Field ${field.name || fieldIndex} in entity ${entity.name || entityIndex} has an invalid type.`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
