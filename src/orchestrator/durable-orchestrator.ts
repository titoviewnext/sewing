import { ArchitectAgent } from '../agents/architect-agent';
import { BackendAgent } from '../agents/backend-agent';
import { FrontendAgent } from '../agents/frontend-agent';
import { ProductAgent } from '../agents/product-agent';
import { QAAgent } from '../agents/qa-agent';
import { validateDSL } from '../dsl/dsl-validator';

export async function orchestratorFunction(rawInput: string): Promise<{
  requirements: string;
  dsl: unknown;
  backendCode: string;
  frontendCode: string;
  qa: { passed: boolean; issues: string[] };
  validationErrors: string[];
}> {
  const productAgent = new ProductAgent();
  const architectAgent = new ArchitectAgent();
  const backendAgent = new BackendAgent();
  const frontendAgent = new FrontendAgent();
  const qaAgent = new QAAgent();

  const requirements = await productAgent.interpretRequirements(rawInput);
  const dsl = await architectAgent.generateDSL(requirements);
  const validation = validateDSL(dsl);

  if (!validation.valid) {
    return {
      requirements,
      dsl,
      backendCode: '',
      frontendCode: '',
      qa: { passed: false, issues: [] },
      validationErrors: validation.errors
    };
  }

  const backendCode = await backendAgent.generateBackend(dsl);
  const frontendCode = await frontendAgent.generateFrontend(dsl);
  const qa = await qaAgent.validate(`${backendCode}\n${frontendCode}`, dsl);

  return {
    requirements,
    dsl,
    backendCode,
    frontendCode,
    qa,
    validationErrors: []
  };
}
