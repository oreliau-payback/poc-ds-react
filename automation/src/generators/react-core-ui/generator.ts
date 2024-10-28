import { generateFiles, Tree } from '@nx/devkit';
import * as path from 'path';
import { ReactCoreUiGeneratorSchema } from './schema';

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

const addExportOnIndexFile = ({
  projectRoot,
  tree,
  options,
  isSource = false,
}: {
  projectRoot: `${ReactCoreUiGeneratorSchema['libName']}`;
  tree: Tree;
  options: ReactCoreUiGeneratorSchema;
  isSource?: boolean;
}) => {
  const filePath = `${projectRoot}/src/index.ts`;

  const contents = tree.read(filePath).toString();

  const sourcePath = isSource
    ? `./components/${options.atomicScope}/${options.componentName}`
    : `../../ui-core/src/components/${options.atomicScope}/${options.componentName}`;
  const newContents = contents.replace(
    '',
    `export { ${kebabToPascal(options.componentName)} } from '${sourcePath}';\n`
  );
  tree.write(filePath, newContents);
};

export async function reactCoreUiGenerator(
  tree: Tree,
  options: ReactCoreUiGeneratorSchema
) {
  const projectRoot = options.libName;

  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    kebabToPascal,
    isMobileOnly: options.libName === 'packages/ui-mobile',
    isWebOnly: options.libName === 'packages/ui-web',
    isMultiPlatform: options.libName === 'packages/ui-core',
    ...options,
  });

  if (['packages/ui-mobile', 'packages/ui-core'].includes(options.libName)) {
    generateFiles(tree, path.join(__dirname, 'file-test-mobile'), projectRoot, {
      kebabToPascal,
      isMobileOnly: options.libName === 'packages/ui-mobile',
      isWebOnly: options.libName === 'packages/ui-web',
      isMultiPlatform: options.libName === 'packages/ui-core',
      ...options,
    });
  }

  if (['packages/ui-web', 'packages/ui-core'].includes(options.libName)) {
    generateFiles(tree, path.join(__dirname, 'file-test-web'), projectRoot, {
      kebabToPascal,
      isMobileOnly: options.libName === 'packages/ui-mobile',
      isWebOnly: options.libName === 'packages/ui-web',
      isMultiPlatform: options.libName === 'packages/ui-core',
      ...options,
    });
  }
  // Add export on the index file
  const exportDestination =
    options.libName === 'packages/ui-core'
      ? (['packages/ui-core', 'packages/ui-mobile', 'packages/ui-web'] as const)
      : [options.libName];

  exportDestination.forEach((libName) => {
    addExportOnIndexFile({
      projectRoot: libName,
      tree,
      options,
      isSource: libName === options.libName,
    });
  });
}

export default reactCoreUiGenerator;
