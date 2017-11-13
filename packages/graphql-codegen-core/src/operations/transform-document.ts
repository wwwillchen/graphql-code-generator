import { DefinitionNode, DocumentNode, FragmentDefinitionNode, GraphQLSchema, OperationDefinitionNode } from 'graphql';
import { debugLog, Document } from 'graphql-codegen-common';
import { transformFragment } from './transform-fragment-document';
import { OPERATION_DEFINITION, FRAGMENT_DEFINITION } from 'graphql/language/kinds';
import { transformOperation } from './transform-operation';

export function transformDocument(schema: GraphQLSchema, documentNode: DocumentNode): Document {
  const result: Document = {
    fragments: [],
    operations: [],
    hasFragments: false,
    hasOperations: false,
  };

  const definitions = (documentNode.definitions || []);

  debugLog(`[transformDocument] transforming total of ${definitions.length} definitions...`);

  definitions.forEach((definitionNode: DefinitionNode) => {
    if (definitionNode.kind === OPERATION_DEFINITION) {
      result.operations.push(transformOperation(schema, definitionNode as OperationDefinitionNode));
    } else if (definitionNode.kind === FRAGMENT_DEFINITION) {
      result.fragments.push(transformFragment(schema, definitionNode as FragmentDefinitionNode));
    } else {
      console.log(`WARNING: It seems like you provided a GraphQL schema instead of GraphQL document: `);
      console.log(definitionNode);
    }
  });

  result.hasFragments = result.fragments.length > 0;
  result.hasOperations = result.operations.length > 0;

  return result;
}
