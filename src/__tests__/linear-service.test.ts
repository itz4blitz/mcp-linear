import { LinearService } from '../services/linear-service.js';

const namedType = (kind: string, name: string) => ({ kind, name, ofType: null });
const nonNullType = (ofType: ReturnType<typeof namedType>) => ({
  kind: 'NON_NULL',
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
