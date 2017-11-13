import * as type from './type.handlebars';
import * as enumTemplate from './enum.handlebars';
import * as scalar from './scalar.handlebars';
import * as union from './union.handlebars';
import * as operation from './operation.handlebars';
import * as fragment from './fragment.handlebars';
import * as selectionSet from '../typescript-single-file/selection-set.handlebars';
import {
  Document, debugLog, CodegenOutput,
  cleanTemplateComments,
} from 'graphql-codegen-common';
import { compile } from 'handlebars';
import { handlersMap } from './handlers';

export const MULTIPLE_FILES_TEMPLATES: { [templateName: string]: string } = {
  type,
  inputType: type,
  'enum': enumTemplate,
  'interface': type,
  scalar,
  union,
  operation,
  fragment,
  selectionSet,
};

export function handleMultiple(compilationContext: any, document: Document): CodegenOutput[] {
  const compiledTemplates = Object.keys(MULTIPLE_FILES_TEMPLATES).map(templateName => {
    debugLog(`[compileTemplate] Compiling template: ${templateName}...`);
    const compiledTemplate = compile(cleanTemplateComments(MULTIPLE_FILES_TEMPLATES[templateName], templateName));

    return {
      key: templateName,
      value: compiledTemplate,
    };
  }).reduce((prev, item) => {
    prev[item.key] = item.value;

    return prev;
  }, {}) as { [name: string]: Function[] };

  debugLog(`[compileTemplate] Templates names: `, Object.keys(compiledTemplates));

  const result: CodegenOutput[] = [];

  Object.keys(MULTIPLE_FILES_TEMPLATES).forEach(templateName => {
    const templateFn = MULTIPLE_FILES_TEMPLATES[templateName];
    debugLog(`[generateMultipleFiles] Using simple handle of type: ${templateName}`);
    const handler = handlersMap[templateName];
    result.push(...handler(templateFn, compilationContext, document, 'd.ts'));
  });

  return result;
}
