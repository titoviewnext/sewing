export class ProductAgent {
  async interpretRequirements(rawInput: string): Promise<string> {
    const normalized = rawInput.trim().replace(/\s+/g, ' ');
    return `Functional requirements: ${normalized}`;
  }
}
