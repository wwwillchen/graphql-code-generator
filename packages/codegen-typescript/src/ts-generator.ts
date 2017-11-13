import {
  prepareSchemaForDocumentsOnly,
  CodegenOutput,
  Settings,
  Document,
  debugLog,
  SchemaTemplateContext,
  GqlGenConfig,
} from 'graphql-codegen-common';
import { handleMultiple, MULTIPLE_FILES_TEMPLATES } from './templates/typescript-multi-file';
import * as moment from 'moment';
import { handleSingle, SINGLE_FILE_TEMPLATE } from './templates/typescript-single-file';
import { initHandlebarsCodegenHelpers } from 'codegen-handlebars-utils';
import { TS_PRIMITIVES } from './constants';
import * as Handlebars from 'handlebars';
import { TypeScriptGeneratorConfig } from './types';

export function compile(config: GqlGenConfig, settings: Settings, document: Document, templateContext: SchemaTemplateContext): CodegenOutput[] {
  const schemaContext = (!settings.generateSchema) ? prepareSchemaForDocumentsOnly(templateContext) : templateContext;

  let templates = SINGLE_FILE_TEMPLATE;

  if (config.generatorConfig.multipleFiles) {
    templates = MULTIPLE_FILES_TEMPLATES;
  }

  Object.keys(templates).forEach((templateName: string) => {
    debugLog(`[compileTemplate] register partial template ${templateName}`);

    Handlebars.registerPartial(templateName, templates[templateName]);
  });

  initHandlebarsCodegenHelpers(TS_PRIMITIVES, templateContext, 'd.ts');

  const compilationContext = {
    currentTime: moment().format(),
    config: config.generatorConfig as TypeScriptGeneratorConfig,
    ...schemaContext,
  };

  if (config.generatorConfig.multipleFiles) {
    return handleMultiple(compilationContext, document);
  } else {
    return handleSingle(compilationContext, document, (config.out === './' || config.out === '') ? './types.d.ts' : config.out);
  }
}
