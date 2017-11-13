import {
  debugLog,
  Document,
  Fragment,
  Operation,
  SchemaTemplateContext,
  Settings,
  GeneratorConfig,
  CodegenOutput,
  OutputProcessorFn,
  flattenTypes,
} from 'graphql-codegen-common';

export const DEFAULT_SETTINGS: Settings = {
  generateSchema: true,
  generateDocuments: true,
};

export function compileTemplate(config: GeneratorConfig, templateContext: SchemaTemplateContext, documents: Document[] = [], settings: Settings = DEFAULT_SETTINGS, outputProcessor: OutputProcessorFn): CodegenOutput[] {
  if (!config) {
    throw new Error(`compileTemplate requires a valid config object!`);
  }

  const executionSettings = Object.assign(DEFAULT_SETTINGS, settings);
  let mergedDocuments: Document;

  if (!executionSettings.generateDocuments) {
    debugLog(`[compileTemplate] generateDocuments is false, ignoring documents...`);

    mergedDocuments = {
      fragments: [],
      operations: [],
      hasFragments: false,
      hasOperations: false,
    };
  } else {
    mergedDocuments = documents.reduce((previousValue: Document, item: Document): Document => {
      const opArr = [...previousValue.operations, ...item.operations] as Operation[];
      const frArr = [...previousValue.fragments, ...item.fragments] as Fragment[];

      return {
        operations: opArr,
        fragments: frArr,
        hasFragments: frArr.length > 0,
        hasOperations: opArr.length > 0,
      };
    }, { hasFragments: false, hasOperations: false, operations: [], fragments: [] } as Document);

    debugLog(
      `[compileTemplate] all documents merged into single document, total of ${mergedDocuments.operations.length} operations and ${mergedDocuments.fragments.length} fragments`
    );
  }

  return outputProcessor(config, settings, flattenTypes(mergedDocuments), templateContext);
}
