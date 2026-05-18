import type { DSLEntity } from '../dsl/dsl-schema';

export class FrontendGenerator {
  generatePage(entity: DSLEntity, pageType: string): string {
    const entityName = entity.name;
    const fieldItems = entity.fields
      .map((field) => `      <li>${field.name}</li>`)
      .join('\n');
    const formInputs = entity.fields
      .map((field) => `        <label>${field.name}<input name=\"${field.name}\" /></label>`)
      .join('\n');

    if (pageType === 'list') {
      return `export default function ${entityName}ListPage() {
  return (
    <main>
      <h1>${entityName} List</h1>
      <p>Generated list page for ${entityName}.</p>
      <ul>
${fieldItems}
      </ul>
    </main>
  );
}
`;
    }

    if (pageType === 'create') {
      return `export default function ${entityName}CreatePage() {
  return (
    <main>
      <h1>Create ${entityName}</h1>
      <form>
${formInputs}
        <button type=\"submit\">Save</button>
      </form>
    </main>
  );
}
`;
    }

    return `export default function ${entityName}DetailPage() {
  return (
    <main>
      <h1>${entityName} Detail</h1>
      <p>Generated detail page for ${entityName}.</p>
      <ul>
${fieldItems}
      </ul>
    </main>
  );
}
`;
  }
}
