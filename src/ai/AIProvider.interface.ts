export interface AIProvider {
  analyze(errorContext: string): Promise<string>;
}
