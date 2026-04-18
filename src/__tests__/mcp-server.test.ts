import { convertToolDefinition } from '../tool-schema.js';
import { removeFromFavoritesToolDefinition } from '../tools/definitions/view-tools.js';

describe('convertToolDefinition', () => {
  it('preserves schema composition keywords like anyOf in inputSchema', () => {
    expect(removeFromFavoritesToolDefinition.input_schema.anyOf).toBeDefined();

    const converted = convertToolDefinition(removeFromFavoritesToolDefinition);

    expect(converted.inputSchema).toEqual(
      expect.objectContaining({
        type: 'object',
        properties: removeFromFavoritesToolDefinition.input_schema.properties,
        anyOf: removeFromFavoritesToolDefinition.input_schema.anyOf,
      }),
    );
  });
});
