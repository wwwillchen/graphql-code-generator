import { OutputProcessorFn } from 'graphql-codegen-common';

export function getCompiler(name: string): OutputProcessorFn | null {
  const alternatives = [
    `codegen-${name}`,
    `codegen-${name}-template`,
    `codegen-${name}-generator`,
    `graphql-codegen-${name}`,
    `graphql-codegen-${name}-template`,
    `graphql-code-generator-${name}`,
    `graphql-code-generator-${name}-template`,
    `code-generator-${name}`,
    `code-generator-${name}-template`,
  ];

  let result = null;

  for (let packageName of alternatives) {
    let requiredValue = null;

    try {
      requiredValue = require(packageName);
    } catch (e) {
      requiredValue = null;
    }

    if (requiredValue) {
      if (typeof requiredValue === 'function') {
        result = requiredValue;

        break;
      } else if (typeof requiredValue === 'object' && requiredValue.default && typeof requiredValue.default === 'function') {
        result = requiredValue.default;

        break;
      } else if (typeof requiredValue === 'object' && requiredValue.compile && typeof requiredValue.compile === 'function') {
        result = requiredValue.default;

        break;
      }
    }
  }

  if (!result) {
    throw new Error(`Unable to find generator with name ${name}.. tried the following: ${alternatives.join(', ')}`);
  }

  return result as OutputProcessorFn;
}
