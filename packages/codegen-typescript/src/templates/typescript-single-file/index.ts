import * as index from './template.handlebars';
import * as type from './type.handlebars';
import * as schema from './schema.handlebars';
import * as documents from './documents.handlebars';
import * as selectionSet from './selection-set.handlebars';
import { Document, CodegenOutput, cleanTemplateComments } from 'graphql-codegen-common';
import { compile } from 'handlebars';

export const SINGLE_FILE_TEMPLATE: { [templateName: string]: string } = {
  index,
  type,
  schema,
  documents,
  selectionSet,
};

export function handleSingle(compilationContext: any, document: Document, outputFile: string): CodegenOutput[] {
  const compiledTemplate = compile(cleanTemplateComments(SINGLE_FILE_TEMPLATE['index']));

  return [
    {
      filename: outputFile,
      content: compiledTemplate({
        ...compilationContext,
        operations: document.operations,
        fragments: document.fragments,
        hasFragments: document.hasFragments,
        hasOperations: document.hasOperations,
      }),
    },
  ];
}
