import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCPToolDefinition } from './types.js';

/**
 * Convert MCPToolDefinition to the MCP SDK Tool format
 */
export function convertToolDefinition(toolDef: MCPToolDefinition): Tool {
  const { type: _type, ...schemaPropertiesWithoutType } = toolDef.input_schema;

  return {
    name: toolDef.name,
    description: toolDef.description,
    inputSchema: {
      type: 'object',
      ...schemaPropertiesWithoutType,
    },
  };
}
