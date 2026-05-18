import type { DSLProject } from '../dsl/dsl-schema';

export class ArchitectAgent {
  private readonly systemPrompt =
    'You are the ArchitectAgent. ALWAYS produce structured DSL JSON. NEVER generate direct source code.';

  async generateDSL(userDescription: string): Promise<DSLProject> {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-4';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION ?? '2024-02-01';
    const apiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!endpoint || !apiKey) {
      return {
        name: 'generated-project',
        version: '1.0.0',
        description: userDescription,
        entities: [
          {
            name: 'Item',
            fields: [
              { name: 'id', type: 'uuid', required: true },
              { name: 'name', type: 'string', required: true }
            ]
          }
        ],
        frontend: {
          pages: ['list', 'create', 'detail'],
          framework: 'nextjs'
        },
        backend: {
          type: 'rest',
          framework: 'nestjs'
        }
      };
    }

    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: this.systemPrompt },
            { role: 'user', content: userDescription }
          ],
          temperature: 0.2
        })
      }
    );

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const rawContent = payload.choices?.[0]?.message?.content;
    if (!rawContent) {
      throw new Error('ArchitectAgent did not receive DSL output from Azure OpenAI.');
    }

    return JSON.parse(rawContent) as DSLProject;
  }
}
