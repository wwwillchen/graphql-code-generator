import { getNamedType, GraphQLSchema, OperationDefinitionNode, typeFromAST, VariableDefinitionNode } from 'graphql';
import { debugLog, Variable } from 'graphql-codegen-common';
import { resolveType } from '../schema/resolve-type';
import { resolveTypeIndicators } from '../schema/resolve-type-indicators';

export function transformVariables(schema: GraphQLSchema, definitionNode: OperationDefinitionNode): Variable[] {
  return definitionNode.variableDefinitions.map<Variable>((variableDefinition: VariableDefinitionNode): Variable => {
    const typeFromSchema = typeFromAST(schema, variableDefinition.type);
    const resolvedType = resolveType(typeFromSchema);
    debugLog(`[transformVariables] transforming variable ${variableDefinition.variable.name.value} of type ${resolvedType.name}`);
    const namedType = getNamedType(typeFromSchema);
    const indicators = resolveTypeIndicators(namedType);

    return {
      name: variableDefinition.variable.name.value,
      type: resolvedType.name,
      isArray: resolvedType.isArray,
      isRequired: resolvedType.isRequired,
      isEnum: indicators.isEnum,
      isScalar: indicators.isScalar,
      isInterface: indicators.isInterface,
      isUnion: indicators.isUnion,
      isInputType: indicators.isInputType,
      isType: indicators.isType,
    };
  });
}
