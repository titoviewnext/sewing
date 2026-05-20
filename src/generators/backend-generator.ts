import type { DSLEntity } from '../dsl/dsl-schema';

export class BackendGenerator {
  generateCRUD(entity: DSLEntity): string {
    const entityName = entity.name;
    const routeName = entity.name.toLowerCase();
    const dtoFields = entity.fields
      .map((field) => {
        const fieldType =
          field.type === 'number'
            ? 'number'
            : field.type === 'boolean'
              ? 'boolean'
              : field.type === 'date'
                ? 'Date'
                : 'string';
        return `  ${field.name}${field.required ? '' : '?'}: ${fieldType};`;
      })
      .join('\n');

    return `import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

interface ${entityName}Dto {
${dtoFields}
}

@Controller('${routeName}')
export class ${entityName}Controller {
  @Get()
  findAll() {
    return { message: 'List ${entityName}' };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: 'Get ${entityName} by id', id };
  }

  @Post()
  create(@Body() payload: ${entityName}Dto) {
    return { message: 'Create ${entityName}', payload };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() payload: ${entityName}Dto) {
    return { message: 'Update ${entityName}', id, payload };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { message: 'Delete ${entityName}', id };
  }
}
`;
  }
}
