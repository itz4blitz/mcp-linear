import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const disallowedTopLevelKeys = ['oneOf', 'anyOf', 'allOf', 'enum', 'not'];
const criticalToolNames = [
  'linear_updateMilestone',
  'linear_updateSavedView',
  'linear_removeFromFavorites',
];

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const repoRoot = path.resolve(scriptDir, '..');
const serverEntryPath = path.join(repoRoot, 'dist/index.js');
const definitionsEntryPath = path.join(repoRoot, 'dist/tools/definitions/index.js');

async function main() {
  const { allToolDefinitions } = await import(pathToFileURL(definitionsEntryPath).href);
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntryPath, '--token', 'mcp-smoke-test-token'],
    cwd: repoRoot,
    env: {
      ...process.env,
      LINEAR_API_TOKEN: 'mcp-smoke-test-token',
    },
    stderr: 'inherit',
  });
  const client = new Client({
    name: 'mcp-linear-smoke-test',
    version: '1.0.0',
  });

  try {
    await client.connect(transport);

    const { tools } = await client.listTools();
    const actualToolNames = tools.map((tool) => tool.name).sort();
    const expectedToolNames = allToolDefinitions.map((tool) => tool.name).sort();

    assert.deepEqual(
      actualToolNames,
      expectedToolNames,
      `MCP server advertised an unexpected tool set. Expected ${expectedToolNames.length} tools, got ${actualToolNames.length}.`,
    );

    for (const tool of tools) {
      assert.equal(
        tool.inputSchema.type,
        'object',
        `Tool ${tool.name} must expose a top-level object input schema.`,
      );

      for (const key of disallowedTopLevelKeys) {
        assert.ok(
          !(key in tool.inputSchema),
          `Tool ${tool.name} exposes disallowed top-level schema key ${key}.`,
        );
      }
    }

    for (const toolName of criticalToolNames) {
      assert.ok(actualToolNames.includes(toolName), `Expected tool ${toolName} to be registered.`);
    }

    console.log(`MCP smoke test passed for ${actualToolNames.length} tools.`);
  } finally {
    await transport.close().catch(() => {});
  }
}

main().catch((error) => {
  console.error('MCP smoke test failed:', error);
  process.exit(1);
});
