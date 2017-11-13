import {
  Interface,
  Operation,
  Fragment,
  Enum,
  Scalar,
  Union,
  sanitizeFilename,
  Type,
  Document,
  SchemaTemplateContext,
  CodegenOutput,
  debugLog,
  GeneratorConfig
} from 'graphql-codegen-common';

function handleSchema(compiledTemplate: Function,
                      schemaContext: SchemaTemplateContext,
                      documents: Document,
                      extraConfig: GeneratorConfig,
                      fileExtension: string,
                      prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleSchema] called`);

  return [{
    filename: prefixAndPath + '.' + (fileExtension || ''),
    content: compiledTemplate({
      config: extraConfig,
      ...schemaContext
    }),
  }];
}

function handleAll(compiledTemplate: Function,
                   schemaContext: SchemaTemplateContext,
                   documents: Document,
                   extraConfig: GeneratorConfig,
                   fileExtension: string,
                   prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleAll] called`);

  return [{
    filename: prefixAndPath + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...schemaContext,
      config: extraConfig,
      operations: documents.operations,
      fragments: documents.fragments,
      hasFragments: documents.hasFragments,
      hasOperations: documents.hasOperations,
    }),
  }];
}

function handleDocuments(compiledTemplate: Function,
                         schemaContext: SchemaTemplateContext,
                         documents: Document,
                         extraConfig: GeneratorConfig,
                         fileExtension: string,
                         prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleDocuments] called`);

  return [{
    filename: prefixAndPath + '.' + (fileExtension || ''),
    content: compiledTemplate({
      config: extraConfig,
      operations: documents.operations,
      fragments: documents.fragments,
      hasFragments: documents.hasFragments,
      hasOperations: documents.hasOperations,
    }),
  }];
}

function handleType(compiledTemplate: Function,
                    schemaContext: SchemaTemplateContext,
                    documents: Document,
                    extraConfig: GeneratorConfig,
                    fileExtension: string,
                    prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleType] called`);

  return schemaContext.types.map((type: Type) => ({
    filename: prefixAndPath + sanitizeFilename(type.name, 'type') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...type,
      config: extraConfig,
    }),
  }));
}

function handleInputType(compiledTemplate: Function,
                         schemaContext: SchemaTemplateContext,
                         documents: Document,
                         extraConfig: GeneratorConfig,
                         fileExtension: string,
                         prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleInputType] called`);

  return schemaContext.inputTypes.map((type: Type) => ({
    filename: prefixAndPath + sanitizeFilename(type.name, 'input-type') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...type,
      config: extraConfig,
    }),
  }));
}

function handleUnion(compiledTemplate: Function,
                     schemaContext: SchemaTemplateContext,
                     documents: Document,
                     extraConfig: GeneratorConfig,
                     fileExtension: string,
                     prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleUnion] called`);

  return schemaContext.unions.map((union: Union) => ({
    filename: prefixAndPath + sanitizeFilename(union.name, 'union') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...union,
      config: extraConfig,
    }),
  }));
}

function handleEnum(compiledTemplate: Function,
                    schemaContext: SchemaTemplateContext,
                    documents: Document,
                    extraConfig: GeneratorConfig,
                    fileExtension: string,
                    prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleEnum] called`);

  return schemaContext.enums.map((en: Enum) => ({
    filename: prefixAndPath + sanitizeFilename(en.name, 'enum') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...en,
      config: extraConfig,
    }),
  }));
}

function handleScalar(compiledTemplate: Function,
                      schemaContext: SchemaTemplateContext,
                      documents: Document,
                      extraConfig: GeneratorConfig,
                      fileExtension: string,
                      prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleScalar] called`);

  return schemaContext.scalars.map((scalar: Scalar) => ({
    filename: prefixAndPath + sanitizeFilename(scalar.name, 'scalar') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...scalar,
      config: extraConfig,
    }),
  }));
}

function handleInterface(compiledTemplate: Function,
                         schemaContext: SchemaTemplateContext,
                         documents: Document,
                         extraConfig: GeneratorConfig,
                         fileExtension: string,
                         prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleInterface] called`);

  return schemaContext.interfaces.map((inf: Interface) => ({
    filename: prefixAndPath + sanitizeFilename(inf.name, 'interface') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...inf,
      config: extraConfig,
    }),
  }));
}

function handleOperation(compiledTemplate: Function,
                         schemaContext: SchemaTemplateContext,
                         documents: Document,
                         extraConfig: GeneratorConfig,
                         fileExtension: string,
                         prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleOperation] called`);

  return documents.operations.map((operation: Operation) => ({
    filename: prefixAndPath + sanitizeFilename(operation.name, operation.operationType) + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...operation,
      config: extraConfig,
    }),
  }));
}

function handleFragment(compiledTemplate: Function,
                        schemaContext: SchemaTemplateContext,
                        documents: Document,
                        extraConfig: GeneratorConfig,
                        fileExtension: string,
                        prefixAndPath = ''): CodegenOutput[] {
  debugLog(`[handleFragment] called`);

  return documents.fragments.map((fragment: Fragment) => ({
    filename: prefixAndPath + sanitizeFilename(fragment.name, 'fragment') + '.' + (fileExtension || ''),
    content: compiledTemplate({
      ...fragment,
      config: extraConfig,
    }),
  }));
}

export const handlersMap = {
  type: handleType,
  inputType: handleInputType,
  union: handleUnion,
  'enum': handleEnum,
  scalar: handleScalar,
  'interface': handleInterface,
  operation: handleOperation,
  fragment: handleFragment,
  schema: handleSchema,
  documents: handleDocuments,
  all: handleAll,
};
