import { LinearService } from '../services/linear-service.js';

const namedType = (kind: string, name: string) => ({ kind, name, ofType: null });
const nonNullType = (ofType: ReturnType<typeof namedType>) => ({
  kind: 'NON_NULL',
  name: null,
  ofType,
});
const listType = (ofType: ReturnType<typeof namedType>) => ({
  kind: 'LIST',
  name: null,
  ofType,
});

function createCustomFieldRequestMock(options?: {
  valueType?: ReturnType<typeof namedType> | ReturnType<typeof nonNullType>;
  mutationResult?: Record<string, unknown>;
}) {
  const valueType = options?.valueType ?? namedType('SCALAR', 'JSONObject');
  const mutationResult = options?.mutationResult ?? { success: true };

  return jest.fn(async (query: string, variables?: Record<string, unknown>) => {
    if (variables?.name === 'Mutation') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'Mutation',
          fields: [
            {
              name: 'issueCustomFieldUpdate',
              description: 'Update a custom field value for an issue',
              args: [
                {
                  name: 'input',
                  type: nonNullType(namedType('INPUT_OBJECT', 'IssueCustomFieldUpdateInput')),
                },
              ],
              type: nonNullType(namedType('OBJECT', 'IssueCustomFieldUpdatePayload')),
            },
          ],
        },
      };
    }

    if (variables?.name === 'IssueCustomFieldUpdateInput') {
      return {
        __type: {
          kind: 'INPUT_OBJECT',
          name: 'IssueCustomFieldUpdateInput',
          inputFields: [
            { name: 'issueId', type: nonNullType(namedType('SCALAR', 'String')) },
            { name: 'customFieldId', type: nonNullType(namedType('SCALAR', 'String')) },
            { name: 'value', type: valueType },
          ],
        },
      };
    }

    if (variables?.name === 'IssueCustomFieldUpdatePayload') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'IssueCustomFieldUpdatePayload',
          fields: [{ name: 'success', args: [], type: namedType('SCALAR', 'Boolean') }],
        },
      };
    }

    if (query.includes('mutation LinearUpdateIssueCustomField')) {
      return {
        issueCustomFieldUpdate: mutationResult,
      };
    }

    throw new Error(`Unexpected GraphQL request: ${query}`);
  });
}

function createGetCustomFieldsRequestMock(options?: {
  includeDefinitionsField?: boolean;
  failQueryIntrospectionOnce?: boolean;
}) {
  const includeDefinitionsField = options?.includeDefinitionsField ?? true;
  let queryIntrospectionFailures = options?.failQueryIntrospectionOnce ? 1 : 0;

  return jest.fn(async (query: string, variables?: Record<string, unknown>) => {
    if (variables?.name === 'Query') {
      if (queryIntrospectionFailures > 0) {
        queryIntrospectionFailures -= 1;
        throw new Error('Transient introspection failure');
      }

      return {
        __type: {
          kind: 'OBJECT',
          name: 'Query',
          fields: includeDefinitionsField
            ? [
                {
                  name: 'customFields',
                  description: 'List custom field definitions',
                  args: [],
                  type: listType(namedType('OBJECT', 'CustomFieldDefinition')),
                },
              ]
            : [{ name: 'issues', description: 'List issues', args: [], type: namedType('OBJECT', 'IssueConnection') }],
        },
      };
    }

    if (variables?.name === 'CustomFieldDefinition') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'CustomFieldDefinition',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'name', args: [], type: namedType('SCALAR', 'String') },
            { name: 'description', args: [], type: namedType('SCALAR', 'String') },
            { name: 'type', args: [], type: namedType('SCALAR', 'String') },
            { name: 'required', args: [], type: namedType('SCALAR', 'Boolean') },
            { name: 'team', args: [], type: namedType('OBJECT', 'Team') },
            { name: 'options', args: [], type: listType(namedType('OBJECT', 'CustomFieldOption')) },
          ],
        },
      };
    }

    if (variables?.name === 'Team') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'Team',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'name', args: [], type: namedType('SCALAR', 'String') },
            { name: 'key', args: [], type: namedType('SCALAR', 'String') },
          ],
        },
      };
    }

    if (variables?.name === 'CustomFieldOption') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'CustomFieldOption',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'name', args: [], type: namedType('SCALAR', 'String') },
            { name: 'color', args: [], type: namedType('SCALAR', 'String') },
          ],
        },
      };
    }

    if (query.includes('query LinearGetCustomFields')) {
      return {
        customFields: {
          nodes: [
            {
              id: 'field-1',
              name: 'Severity',
              description: 'Risk score',
              type: 'enum',
              required: true,
              team: { id: 'team-1', name: 'Platform', key: 'PLAT' },
              options: [{ id: 'opt-1', name: 'High', color: '#f00' }],
            },
          ],
        },
      };
    }

    throw new Error(`Unexpected GraphQL request: ${query}`);
  });
}

function createGetIssueCustomFieldsRequestMock(options?: { includeIssueField?: boolean }) {
  const includeIssueField = options?.includeIssueField ?? true;

  return jest.fn(async (query: string, variables?: Record<string, unknown>) => {
    if (variables?.name === 'Issue') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'Issue',
          fields: includeIssueField
            ? [
                {
                  name: 'customFieldValues',
                  description: 'Issue custom field values',
                  args: [],
                  type: listType(namedType('OBJECT', 'IssueCustomFieldValue')),
                },
              ]
            : [{ name: 'title', description: 'Issue title', args: [], type: namedType('SCALAR', 'String') }],
        },
      };
    }

    if (variables?.name === 'IssueCustomFieldValue') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'IssueCustomFieldValue',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'customFieldId', args: [], type: namedType('SCALAR', 'String') },
            { name: 'displayValue', args: [], type: namedType('SCALAR', 'String') },
            { name: 'value', args: [], type: namedType('SCALAR', 'JSONObject') },
            { name: 'customField', args: [], type: namedType('OBJECT', 'CustomFieldDefinition') },
          ],
        },
      };
    }

    if (variables?.name === 'CustomFieldDefinition') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'CustomFieldDefinition',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'name', args: [], type: namedType('SCALAR', 'String') },
            { name: 'type', args: [], type: namedType('SCALAR', 'String') },
          ],
        },
      };
    }

    if (query.includes('query LinearGetIssueCustomFields')) {
      return {
        issue: {
          id: 'issue-1',
          identifier: 'ABC-1',
          customFieldValues: {
            nodes: [
              {
                id: 'value-1',
                customFieldId: 'field-1',
                displayValue: 'High',
                value: { rank: 10 },
                customField: {
                  id: 'field-1',
                  name: 'Severity',
                  type: 'enum',
                },
              },
            ],
          },
        },
      };
    }

    throw new Error(`Unexpected GraphQL request: ${query}`);
  });
}

describe('LinearService optional field sanitization', () => {
  it('omits empty optional fields when creating an issue', async () => {
    const createIssue = jest.fn().mockResolvedValue({
      success: true,
      issue: Promise.resolve({
        id: 'issue-1',
        title: 'Test issue',
        description: 'Body',
        url: 'https://linear.app/issue-1',
      }),
    });
    const service = new LinearService({ createIssue } as never);

    await service.createIssue({
      title: 'Test issue',
      description: 'Body',
      teamId: 'team-1',
      assigneeId: '',
      projectId: '',
      cycleId: '',
      dueDate: '',
      labelIds: [],
      parentId: '',
      subscriberIds: [],
      stateId: '',
      templateId: '',
    });

    expect(createIssue).toHaveBeenCalledWith({
      title: 'Test issue',
      description: 'Body',
      teamId: 'team-1',
    });
  });

  it('omits empty optional fields and conflicting label arrays when updating an issue', async () => {
    const updateIssue = jest.fn().mockResolvedValue({
      success: true,
      issue: Promise.resolve({
        id: 'issue-1',
        title: 'Updated issue',
        description: 'Updated body',
        url: 'https://linear.app/issue-1',
      }),
    });
    const service = new LinearService({ updateIssue } as never);

    await service.updateIssue({
      id: 'issue-1',
      stateId: 'state-1',
      dueDate: '',
      assigneeId: '',
      cycleId: '',
      parentId: '',
      labelIds: ['label-1'],
      addedLabelIds: [],
      removedLabelIds: [],
      subscriberIds: [],
      teamId: '',
    });

    expect(updateIssue).toHaveBeenCalledWith('issue-1', {
      stateId: 'state-1',
      labelIds: ['label-1'],
    });
  });

  it('prefers incremental label changes when provided for issue updates', async () => {
    const updateIssue = jest.fn().mockResolvedValue({
      success: true,
      issue: Promise.resolve({
        id: 'issue-1',
        title: 'Updated issue',
        description: 'Updated body',
        url: 'https://linear.app/issue-1',
      }),
    });
    const service = new LinearService({ updateIssue } as never);

    await service.updateIssue({
      id: 'issue-1',
      labelIds: ['label-1'],
      addedLabelIds: ['label-2'],
      removedLabelIds: ['label-3'],
    });

    expect(updateIssue).toHaveBeenCalledWith('issue-1', {
      addedLabelIds: ['label-2'],
      removedLabelIds: ['label-3'],
    });
  });

  it('omits empty parentId when creating a top-level comment', async () => {
    const createComment = jest.fn().mockResolvedValue({
      success: true,
      comment: Promise.resolve({
        id: 'comment-1',
        body: 'hello',
        url: 'https://linear.app/comment-1',
        parent: null,
      }),
    });
    const service = new LinearService({ createComment } as never);

    await service.createComment({
      issueId: 'issue-1',
      body: 'hello',
      parentId: '',
    });

    expect(createComment).toHaveBeenCalledWith({
      issueId: 'issue-1',
      body: 'hello',
    });
  });
});

describe('LinearService custom field updates', () => {
  it('passes structured JSON values through to the discovered custom field mutation', async () => {
    const request = createCustomFieldRequestMock();
    const service = new LinearService({ client: { request } } as never);
    const value = {
      selected: true,
      thresholds: [1, 2, 3],
      metadata: { phase: 'beta' },
    };

    await service.updateIssueCustomField({
      issueId: 'issue-1',
      customFieldId: 'field-1',
      value,
    });

    const mutationCall = request.mock.calls.find(([query]) =>
      String(query).includes('mutation LinearUpdateIssueCustomField'),
    );

    expect(mutationCall?.[1]).toEqual({
      input: {
        issueId: 'issue-1',
        customFieldId: 'field-1',
        value,
      },
    });
  });

  it('passes null through when clearing a custom field value', async () => {
    const request = createCustomFieldRequestMock();
    const service = new LinearService({ client: { request } } as never);

    await service.updateIssueCustomField({
      issueId: 'issue-1',
      customFieldId: 'field-1',
      value: null,
    });

    const mutationCall = request.mock.calls.find(([query]) =>
      String(query).includes('mutation LinearUpdateIssueCustomField'),
    );

    expect(mutationCall?.[1]).toEqual({
      input: {
        issueId: 'issue-1',
        customFieldId: 'field-1',
        value: null,
      },
    });
  });

  it('fails fast when the discovered value slot does not accept the provided value shape', async () => {
    const request = createCustomFieldRequestMock({ valueType: namedType('SCALAR', 'String') });
    const service = new LinearService({ client: { request } } as never);

    await expect(
      service.updateIssueCustomField({
        issueId: 'issue-1',
        customFieldId: 'field-1',
        value: { unsupported: true } as never,
      }),
    ).rejects.toThrow(
      'The custom field mutation does not expose a value argument that matches the provided data',
    );
  });
});

describe('LinearService custom field discovery', () => {
  it('returns normalized custom fields from schema-discovered definitions query', async () => {
    const request = createGetCustomFieldsRequestMock();
    const service = new LinearService({ client: { request } } as never);

    const customFields = await service.getCustomFields();

    expect(customFields).toHaveLength(1);
    expect(customFields[0]).toEqual(
      expect.objectContaining({
        id: 'field-1',
        name: 'Severity',
        description: 'Risk score',
        type: 'enum',
        required: true,
        team: { id: 'team-1', name: 'Platform', key: 'PLAT' },
        options: [{ id: 'opt-1', name: 'High', color: '#f00', raw: expect.any(Object) }],
      }),
    );
  });

  it('retries type discovery after transient introspection errors', async () => {
    const request = createGetCustomFieldsRequestMock({ failQueryIntrospectionOnce: true });
    const service = new LinearService({ client: { request } } as never);

    await expect(service.getCustomFields()).rejects.toThrow('Transient introspection failure');
    await expect(service.getCustomFields()).resolves.toEqual(expect.any(Array));
  });

  it('fails when schema does not expose a custom field definitions query', async () => {
    const request = createGetCustomFieldsRequestMock({ includeDefinitionsField: false });
    const service = new LinearService({ client: { request } } as never);

    await expect(service.getCustomFields()).rejects.toThrow(
      'The authenticated Linear schema does not expose a custom field definitions query',
    );
  });

  it('returns normalized custom field values for an issue', async () => {
    const request = createGetIssueCustomFieldsRequestMock();
    const service = new LinearService({ client: { request } } as never);

    const result = await service.getIssueCustomFields('issue-1');

    expect(result).toEqual(
      expect.objectContaining({
        issueId: 'issue-1',
        identifier: 'ABC-1',
        customFields: [
          expect.objectContaining({
            id: 'value-1',
            customFieldId: 'field-1',
            displayValue: 'High',
            value: { rank: 10 },
            customField: expect.objectContaining({
              id: 'field-1',
              name: 'Severity',
              type: 'enum',
            }),
          }),
        ],
      }),
    );
  });

  it('fails when schema does not expose custom field values on Issue', async () => {
    const request = createGetIssueCustomFieldsRequestMock({ includeIssueField: false });
    const service = new LinearService({ client: { request } } as never);

    await expect(service.getIssueCustomFields('issue-1')).rejects.toThrow(
      'The authenticated Linear schema does not expose issue custom field values on Issue',
    );
  });
});
