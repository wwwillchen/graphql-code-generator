import {
  SelectionSetItem,
  SelectionSetFieldNode,
  SelectionSetFragmentSpread,
  SelectionSetInlineFragment
} from './types';

export function isFieldNode(node: SelectionSetItem): node is SelectionSetFieldNode {
  return node['name'] !== undefined && node['selectionSet'] !== undefined && node['type'] !== undefined;
}

export function isFragmentSpreadNode(node: SelectionSetItem): node is SelectionSetFragmentSpread {
  return node['fragmentName'] !== undefined;
}

export function isInlineFragmentNode(node: SelectionSetItem): node is SelectionSetInlineFragment {
  return node['selectionSet'] !== undefined && node['onType'] !== undefined;
}
