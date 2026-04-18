import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCPToolDefinition } from './types.js';

/**
 * Convert MCPToolDefinition to the MCP SDK Tool format
 */
export function convertToolDefinition(toolDef: MCPToolDefinition): Tool {
  return {
    name: toolDef.name,
    description: toolDef.description,
    inputSchema: {
      ...toolDef.input_schema,
      type: 'object',
      properties: toolDef.input_schema.properties,
    },
  };
}
