import {
  prepareSchemaForDocumentsOnly,
  GeneratorConfig,
  CodegenOutput,
  Settings,
  Document,
  debugLog,
  SchemaTemplateContext
} from 'graphql-codegen-common';
import { TypeScriptCodegenConfig } from './types';
import { handleMultiple, MULTIPLE_FILES_TEMPLATES } from './templates/typescript-multi-file';
import * as moment from 'moment';
import { handleSingle, SINGLE_FILE_TEMPLATE } from './templates/typescript-single-file';
import { initHandlebarsCodegenHelpers } from 'codegen-handlebars-utils';
import { TS_PRIMITIVES } from './constants';
import * as Handlebars from 'handlebars';

export function compile(config: TypeScriptCodegenConfig & GeneratorConfig, settings: Settings, document: Document, templateContext: SchemaTemplateContext): CodegenOutput[] {
  const schemaContext = (!settings.generateSchema) ? prepareSchemaForDocumentsOnly(templateContext) : templateContext;

  let templates = SINGLE_FILE_TEMPLATE;

  if (config.multipleFiles) {
    templates = MULTIPLE_FILES_TEMPLATES;
  }

  Object.keys(templates).forEach((templateName: string) => {
    debugLog(`[compileTemplate] register partial template ${templateName}`);

    Handlebars.registerPartial(templateName, templates[templateName]);
  });

  initHandlebarsCodegenHelpers(TS_PRIMITIVES, templateContext, 'd.ts');

  const compilationContext = {
    currentTime: moment().format(),
    config,
    ...schemaContext,
  };

  if (config.multipleFiles) {
    return handleMultiple(compilationContext, document);
  } else {
    return handleSingle(compilationContext, document, (config.out === './' || config.out === '') ? './types.d.ts' : config.out);
  }
}
