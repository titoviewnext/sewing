export interface DSLProject {
  name: string;
  version: string;
  description?: string;
  entities: DSLEntity[];
  frontend: DSLFrontend;
  backend: DSLBackend;
}

export interface DSLEntity {
  name: string;
  fields: DSLField[];
}

export interface DSLField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'uuid';
  required?: boolean;
}

export interface DSLFrontend {
  pages: string[];
  framework?: 'nextjs' | 'react';
}

export interface DSLBackend {
  type: 'rest' | 'graphql';
  framework?: 'nestjs' | 'express';
}
