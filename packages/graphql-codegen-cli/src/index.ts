#!/usr/bin/env node

import * as fs from 'fs';
import { initCLI, executeWithOptions, cliError } from './cli';
import { debugLog, CodegenOutput } from 'graphql-codegen-common';

const options = initCLI(process.argv);

debugLog(`Started CLI with options: `, options);

executeWithOptions(options)
  .then((generationResult: CodegenOutput[]) => {
    debugLog(`Generation result contains total of ${generationResult.length} files...`);

    if (process.env.VERBOSE !== undefined) {
      console.log(`Generation result is: `, generationResult);
    }

    generationResult.forEach((result: CodegenOutput) => {
      fs.writeFileSync(result.filename, result.content);
      console.log(`Generated file written to ${result.filename}`);
    });
  })
  .catch(cliError);
