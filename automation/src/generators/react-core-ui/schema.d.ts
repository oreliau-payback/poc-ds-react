export interface ReactCoreUiGeneratorSchema {
  componentName: string;
  atomicScope: 'atoms' | 'molecules' | 'organisms' | 'layouts';
  libName: 'packages/ui-core' | 'packages/ui-mobile' | 'packages/ui-web';
}
