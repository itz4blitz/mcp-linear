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

function createFavoriteMutationRequestMock(options?: {
  mode?: 'add' | 'remove';
  idField?: 'entityId' | 'favoriteId' | 'id';
  useInputObject?: boolean;
  mutationResult?: Record<string, unknown>;
}) {
  const mode = options?.mode ?? 'add';
  const mutationFieldName = mode === 'add' ? 'addFavorite' : 'removeFavorite';
  const inputTypeName = mode === 'add' ? 'AddFavoriteInput' : 'RemoveFavoriteInput';
  const idField = options?.idField ?? (mode === 'add' ? 'entityId' : 'favoriteId');
  const useInputObject = options?.useInputObject ?? true;
  const mutationResult = options?.mutationResult ?? {
    success: true,
    favorite: {
      id: 'favorite-1',
      type: 'customView',
      sortOrder: 1,
      customView: {
        id: 'view-1',
        name: 'My saved view',
        slugId: 'my-saved-view',
        shared: true,
      },
      predefinedViewType: null,
      predefinedViewTeam: null,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
      url: 'https://linear.app/view-1',
    },
  };

  return jest.fn(async (query: string, variables?: Record<string, unknown>) => {
    if (variables?.name === 'Mutation') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'Mutation',
          fields: [
            {
              name: mutationFieldName,
              description:
                mode === 'add' ? 'Add an item to favorites' : 'Remove an item from favorites',
              args: useInputObject
                ? [
                    {
                      name: 'input',
                      type: nonNullType(namedType('INPUT_OBJECT', inputTypeName)),
                    },
                  ]
                : [{ name: idField, type: nonNullType(namedType('SCALAR', 'String')) }],
              type: nonNullType(namedType('OBJECT', `${inputTypeName}Payload`)),
            },
          ],
        },
      };
    }

    if (variables?.name === inputTypeName && useInputObject) {
      return {
        __type: {
          kind: 'INPUT_OBJECT',
          name: inputTypeName,
          inputFields: [{ name: idField, type: nonNullType(namedType('SCALAR', 'String')) }],
        },
      };
    }

    if (variables?.name === `${inputTypeName}Payload`) {
      return {
        __type: {
          kind: 'OBJECT',
          name: `${inputTypeName}Payload`,
          fields: [
            { name: 'success', args: [], type: namedType('SCALAR', 'Boolean') },
            { name: 'favorite', args: [], type: namedType('OBJECT', 'Favorite') },
          ],
        },
      };
    }

    if (variables?.name === 'Favorite') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'Favorite',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'type', args: [], type: namedType('SCALAR', 'String') },
            { name: 'sortOrder', args: [], type: namedType('SCALAR', 'Float') },
            { name: 'createdAt', args: [], type: namedType('SCALAR', 'DateTime') },
            { name: 'updatedAt', args: [], type: namedType('SCALAR', 'DateTime') },
            { name: 'url', args: [], type: namedType('SCALAR', 'String') },
            { name: 'customView', args: [], type: namedType('OBJECT', 'CustomView') },
            { name: 'predefinedViewType', args: [], type: namedType('SCALAR', 'String') },
            { name: 'predefinedViewTeam', args: [], type: namedType('OBJECT', 'Team') },
          ],
        },
      };
    }

    if (variables?.name === 'CustomView') {
      return {
        __type: {
          kind: 'OBJECT',
          name: 'CustomView',
          fields: [
            { name: 'id', args: [], type: namedType('SCALAR', 'String') },
            { name: 'name', args: [], type: namedType('SCALAR', 'String') },
            { name: 'slugId', args: [], type: namedType('SCALAR', 'String') },
            { name: 'shared', args: [], type: namedType('SCALAR', 'Boolean') },
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
          ],
        },
      };
    }

    if (query.includes(`mutation ${mode === 'add' ? 'LinearAddToFavorites' : 'LinearRemoveFromFavorites'}`)) {
      return {
        [mutationFieldName]: mutationResult,
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

  it('omits empty optional fields when creating a saved view', async () => {
    const createCustomView = jest.fn().mockResolvedValue({
      success: true,
      customView: Promise.resolve({
        id: 'view-1',
        name: 'My view',
        description: undefined,
        shared: false,
        icon: undefined,
        color: undefined,
        slugId: 'my-view',
        filterData: {},
        filters: {},
        projectFilterData: undefined,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      }),
    });
    const service = new LinearService({ createCustomView } as never);

    await service.createSavedView({
      name: 'My view',
      description: '',
      shared: false,
      icon: '',
      color: '',
      teamId: '',
      projectId: '',
      ownerId: '',
      filters: {},
      filterData: {},
      projectFilterData: {},
    });

    expect(createCustomView).toHaveBeenCalledWith({
      name: 'My view',
      shared: false,
    });
  });

  it('omits empty optional fields when creating a milestone', async () => {
    const createProjectMilestone = jest.fn().mockResolvedValue({
      success: true,
      projectMilestone: Promise.resolve({
        id: 'milestone-1',
        name: 'Beta',
        description: undefined,
        status: 'unstarted',
        progress: 0,
        sortOrder: 1,
        targetDate: undefined,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        archivedAt: undefined,
        project: Promise.resolve({ id: 'project-1', name: 'Project One' }),
      }),
    });
    const service = new LinearService({ createProjectMilestone } as never);

    await service.createMilestone({
      name: 'Beta',
      projectId: 'project-1',
      description: '',
      targetDate: '',
    });

    expect(createProjectMilestone).toHaveBeenCalledWith({
      name: 'Beta',
      projectId: 'project-1',
    });
  });

  it('omits empty optional fields when updating a milestone', async () => {
    const updateProjectMilestone = jest.fn().mockResolvedValue({
      success: true,
      projectMilestone: Promise.resolve({
        id: 'milestone-1',
        name: 'Beta',
        description: undefined,
        status: 'unstarted',
        progress: 0,
        sortOrder: 2,
        targetDate: undefined,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        archivedAt: undefined,
        project: Promise.resolve({ id: 'project-1', name: 'Project One' }),
      }),
    });
    const service = new LinearService({ updateProjectMilestone } as never);

    await service.updateMilestone({
      id: 'milestone-1',
      name: 'Beta',
      description: '',
      targetDate: '',
      sortOrder: 2,
    });

    expect(updateProjectMilestone).toHaveBeenCalledWith('milestone-1', {
      name: 'Beta',
      sortOrder: 2,
    });
  });

  it('requires at least one milestone field for updates', async () => {
    const service = new LinearService({ updateProjectMilestone: jest.fn() } as never);

    await expect(service.updateMilestone({ id: 'milestone-1' })).rejects.toThrow(
      'At least one milestone field must be provided',
    );
  });

  it('omits empty optional fields when updating a saved view', async () => {
    const updateCustomView = jest.fn().mockResolvedValue({
      success: true,
      customView: Promise.resolve({
        id: 'view-1',
        name: 'Updated view',
        description: undefined,
        shared: false,
        icon: undefined,
        color: undefined,
        slugId: 'updated-view',
        filterData: {},
        filters: {},
        projectFilterData: undefined,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-03T00:00:00.000Z'),
      }),
    });
    const service = new LinearService({ updateCustomView } as never);

    await service.updateSavedView({
      id: 'view-1',
      name: '',
      description: '',
      shared: false,
      icon: '',
      color: '',
      teamId: '',
      projectId: '',
      ownerId: '',
      filters: {},
      filterData: {},
      projectFilterData: {},
    });

    expect(updateCustomView).toHaveBeenCalledWith('view-1', {
      shared: false,
    });
  });

  it('preserves explicit nulls when updating a saved view to clear fields', async () => {
    const updateCustomView = jest.fn().mockResolvedValue({
      success: true,
      customView: Promise.resolve({
        id: 'view-1',
        name: 'Updated view',
        description: null,
        shared: false,
        icon: null,
        color: null,
        slugId: 'updated-view',
        filterData: {},
        filters: {},
        projectFilterData: null,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-03T00:00:00.000Z'),
      }),
    });
    const service = new LinearService({ updateCustomView } as never);

    await service.updateSavedView({
      id: 'view-1',
      description: null,
      icon: null,
      color: null,
      teamId: null,
      projectId: null,
      ownerId: null,
      filters: null,
      filterData: null,
      projectFilterData: null,
    });

    expect(updateCustomView).toHaveBeenCalledWith('view-1', {
      description: null,
      icon: null,
      color: null,
      teamId: null,
      projectId: null,
      ownerId: null,
      filters: null,
      filterData: null,
      projectFilterData: null,
    });
  });

  it('rejects saved view updates without any fields to change', async () => {
    const updateCustomView = jest.fn();
    const service = new LinearService({ updateCustomView } as never);

    await expect(service.updateSavedView({ id: 'view-1' })).rejects.toThrow(
      'At least one saved view field must be provided',
    );
    expect(updateCustomView).not.toHaveBeenCalled();
  });

  it('forwards saved view pagination options to the Linear SDK', async () => {
    const customViews = jest.fn().mockResolvedValue({ nodes: [] });
    const service = new LinearService({ customViews } as never);

    await service.getSavedViews({
      limit: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    expect(customViews).toHaveBeenCalledWith({
      first: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });
  });

  it('forwards favorite view pagination options to the Linear GraphQL client', async () => {
    const request = jest.fn().mockResolvedValue({ favorites: { nodes: [] } });
    const service = new LinearService({ client: { request } } as never);

    await service.getFavoriteViews({
      limit: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('favorites('),
      {
        first: 5,
        includeArchived: true,
        orderBy: 'updatedAt',
      },
    );
  });

  it('filters non-view favorites out of favorite view results', async () => {
    const request = jest.fn().mockResolvedValue({
      favorites: {
        nodes: [
          {
            id: 'favorite-1',
            type: 'customView',
            sortOrder: 1,
            customView: {
              id: 'view-1',
              name: 'My saved view',
              slugId: 'my-saved-view',
              shared: true,
            },
            predefinedViewType: undefined,
            predefinedViewTeam: undefined,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z',
            url: 'https://linear.app/view-1',
          },
          {
            id: 'favorite-2',
            type: 'predefinedView',
            sortOrder: 2,
            customView: undefined,
            predefinedViewType: 'assigned',
            predefinedViewTeam: {
              id: 'team-1',
              name: 'Core Product',
            },
            createdAt: '2024-01-03T00:00:00.000Z',
            updatedAt: '2024-01-04T00:00:00.000Z',
            url: 'https://linear.app/predefined-view',
          },
          {
            id: 'favorite-3',
            type: 'issue',
            sortOrder: 3,
            customView: undefined,
            predefinedViewType: undefined,
            predefinedViewTeam: undefined,
            createdAt: '2024-01-05T00:00:00.000Z',
            updatedAt: '2024-01-06T00:00:00.000Z',
            url: 'https://linear.app/issue/ISS-1',
          },
        ],
      },
    });
    const service = new LinearService({ client: { request } } as never);

    const result = await service.getFavoriteViews();

    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('query FavoriteViews'),
      expect.objectContaining({
        first: 25,
        includeArchived: false,
      }),
    );
    expect(result).toHaveLength(2);
    expect(result).toEqual([
      {
        id: 'favorite-1',
        type: 'customView',
        sortOrder: 1,
        customView: {
          id: 'view-1',
          name: 'My saved view',
          slugId: 'my-saved-view',
          shared: true,
        },
        predefinedViewType: null,
        predefinedViewTeam: null,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        url: 'https://linear.app/view-1',
      },
      {
        id: 'favorite-2',
        type: 'predefinedView',
        sortOrder: 2,
        customView: null,
        predefinedViewType: 'assigned',
        predefinedViewTeam: {
          id: 'team-1',
          name: 'Core Product',
        },
        createdAt: new Date('2024-01-03T00:00:00.000Z'),
        updatedAt: new Date('2024-01-04T00:00:00.000Z'),
        url: 'https://linear.app/predefined-view',
      },
    ]);
  });

  it('adds an entity to favorites through the schema-driven GraphQL mutation', async () => {
    const request = createFavoriteMutationRequestMock({ mode: 'add', idField: 'entityId' });
    const service = new LinearService({ client: { request } } as never);

    const result = await service.addToFavorites({ entityId: 'view-1' });

    expect(result).toEqual({
      success: true,
      id: 'favorite-1',
      entityId: null,
      favorite: {
        id: 'favorite-1',
        type: 'customView',
        sortOrder: 1,
        customView: {
          id: 'view-1',
          name: 'My saved view',
          slugId: 'my-saved-view',
          shared: true,
        },
        predefinedViewType: null,
        predefinedViewTeam: null,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        url: 'https://linear.app/view-1',
      },
    });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearAddToFavorites'),
      expect.objectContaining({
        input: {
          entityId: 'view-1',
        },
      }),
    );
  });

  it('adds an entity to favorites through a direct id argument mutation', async () => {
    const request = createFavoriteMutationRequestMock({
      mode: 'add',
      idField: 'id',
      useInputObject: false,
    });
    const service = new LinearService({ client: { request } } as never);

    const result = await service.addToFavorites({ entityId: 'view-1' });

    expect(result.success).toBe(true);
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearAddToFavorites'),
      expect.objectContaining({
        id: 'view-1',
      }),
    );
    expect(request).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        input: expect.anything(),
      }),
    );
  });

  it('removes a favorite by favoriteId through the schema-driven GraphQL mutation', async () => {
    const request = createFavoriteMutationRequestMock({
      mode: 'remove',
      idField: 'favoriteId',
      mutationResult: { success: true },
    });
    const service = new LinearService({ client: { request } } as never);

    const result = await service.removeFromFavorites({ favoriteId: 'favorite-1' });

    expect(result).toEqual({
      success: true,
      id: null,
      entityId: null,
      favorite: null,
    });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearRemoveFromFavorites'),
      expect.objectContaining({
        input: {
          favoriteId: 'favorite-1',
        },
      }),
    );
  });

  it('removes a favorite by entityId when the schema supports entity-based removal', async () => {
    const request = createFavoriteMutationRequestMock({
      mode: 'remove',
      idField: 'entityId',
      mutationResult: { success: true },
    });
    const service = new LinearService({ client: { request } } as never);

    const result = await service.removeFromFavorites({ entityId: 'view-1' });

    expect(result).toEqual({
      success: true,
      id: null,
      entityId: null,
      favorite: null,
    });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining('mutation LinearRemoveFromFavorites'),
      expect.objectContaining({
        input: {
          entityId: 'view-1',
        },
      }),
    );
  });

  it('throws when removing by entityId but schema only supports favorite identifiers', async () => {
    const request = createFavoriteMutationRequestMock({
      mode: 'remove',
      idField: 'favoriteId',
      mutationResult: { success: true },
    });
    const service = new LinearService({ client: { request } } as never);

    await expect(service.removeFromFavorites({ entityId: 'view-1' })).rejects.toThrow(
      'The favorite removal mutation does not expose an entity identifier argument; use favoriteId for this schema',
    );
  });
});

describe('LinearService issue unlink operations', () => {
  it('removes an issue from a project', async () => {
    const issue = jest
      .fn()
      .mockResolvedValueOnce({
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
        project: Promise.resolve({
          id: 'project-1',
          name: 'Roadmap',
        }),
      })
      .mockResolvedValueOnce({
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
      });
    const project = jest.fn().mockResolvedValue({
      id: 'project-1',
      name: 'Roadmap',
    });
    const updateIssue = jest.fn().mockResolvedValue({ success: true });
    const service = new LinearService({ issue, project, updateIssue } as never);

    await expect(service.removeIssueFromProject('ABC-123', 'project-1')).resolves.toEqual({
      success: true,
      issue: {
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
      },
      project: {
        id: 'project-1',
        name: 'Roadmap',
      },
    });

    expect(updateIssue).toHaveBeenCalledWith('issue-1', { projectId: null });
  });

  it('fails removing an issue from a project when the issue is not found', async () => {
    const issue = jest.fn().mockResolvedValue(null);
    const project = jest.fn();
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, project, updateIssue } as never);

    await expect(service.removeIssueFromProject('ABC-123', 'project-1')).rejects.toThrow(
      'Issue with ID ABC-123 not found',
    );

    expect(project).not.toHaveBeenCalled();
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it('fails removing an issue from a project when the issue is not associated with the project', async () => {
    const issue = jest.fn().mockResolvedValue({
      id: 'issue-1',
      identifier: 'ABC-123',
      title: 'Test issue',
      project: Promise.resolve({
        id: 'project-2',
        name: 'Other',
      }),
    });
    const project = jest.fn();
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, project, updateIssue } as never);

    await expect(service.removeIssueFromProject('ABC-123', 'project-1')).rejects.toThrow(
      'Issue ABC-123 is not associated with project project-1',
    );

    expect(project).not.toHaveBeenCalled();
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it('fails removing an issue from a project when the project does not exist', async () => {
    const issue = jest.fn().mockResolvedValue({
      id: 'issue-1',
      identifier: 'ABC-123',
      title: 'Test issue',
      project: Promise.resolve({
        id: 'project-1',
        name: 'Roadmap',
      }),
    });
    const project = jest.fn().mockResolvedValue(null);
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, project, updateIssue } as never);

    await expect(service.removeIssueFromProject('ABC-123', 'project-1')).rejects.toThrow(
      'Project with ID project-1 not found',
    );

    expect(updateIssue).not.toHaveBeenCalled();
  });

  it('removes an issue from a cycle', async () => {
    const issue = jest
      .fn()
      .mockResolvedValueOnce({
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
        cycle: Promise.resolve({
          id: 'cycle-1',
          number: 42,
          name: 'Sprint 42',
        }),
      })
      .mockResolvedValueOnce({
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
      });
    const cycle = jest.fn().mockResolvedValue({
      id: 'cycle-1',
      number: 42,
      name: 'Sprint 42',
    });
    const updateIssue = jest.fn().mockResolvedValue({ success: true });
    const service = new LinearService({ issue, cycle, updateIssue } as never);

    await expect(service.removeIssueFromCycle('ABC-123', 'cycle-1')).resolves.toEqual({
      success: true,
      issue: {
        id: 'issue-1',
        identifier: 'ABC-123',
        title: 'Test issue',
      },
      cycle: {
        id: 'cycle-1',
        number: 42,
        name: 'Sprint 42',
      },
    });

    expect(updateIssue).toHaveBeenCalledWith('issue-1', { cycleId: null });
  });

  it('fails removing an issue from a cycle when the issue is not found', async () => {
    const issue = jest.fn().mockResolvedValue(null);
    const cycle = jest.fn();
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, cycle, updateIssue } as never);

    await expect(service.removeIssueFromCycle('ABC-123', 'cycle-1')).rejects.toThrow(
      'Issue with ID ABC-123 not found',
    );

    expect(cycle).not.toHaveBeenCalled();
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it('fails removing an issue from a cycle when the issue is not associated with the cycle', async () => {
    const issue = jest.fn().mockResolvedValue({
      id: 'issue-1',
      identifier: 'ABC-123',
      title: 'Test issue',
      cycle: Promise.resolve({
        id: 'cycle-2',
        number: 43,
        name: 'Sprint 43',
      }),
    });
    const cycle = jest.fn();
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, cycle, updateIssue } as never);

    await expect(service.removeIssueFromCycle('ABC-123', 'cycle-1')).rejects.toThrow(
      'Issue ABC-123 is not associated with cycle cycle-1',
    );

    expect(cycle).not.toHaveBeenCalled();
    expect(updateIssue).not.toHaveBeenCalled();
  });

  it('fails removing an issue from a cycle when the cycle does not exist', async () => {
    const issue = jest.fn().mockResolvedValue({
      id: 'issue-1',
      identifier: 'ABC-123',
      title: 'Test issue',
      cycle: Promise.resolve({
        id: 'cycle-1',
        number: 42,
        name: 'Sprint 42',
      }),
    });
    const cycle = jest.fn().mockResolvedValue(null);
    const updateIssue = jest.fn();
    const service = new LinearService({ issue, cycle, updateIssue } as never);

    await expect(service.removeIssueFromCycle('ABC-123', 'cycle-1')).rejects.toThrow(
      'Cycle with ID cycle-1 not found',
    );

    expect(updateIssue).not.toHaveBeenCalled();
  });
});

describe('LinearService roadmap operations', () => {
  it('returns normalized roadmaps when the feature is enabled', async () => {
    const roadmaps = jest.fn().mockResolvedValue({
      nodes: [
        {
          id: 'roadmap-1',
          name: 'Platform Roadmap',
          description: 'Quarterly priorities',
          color: '#123456',
          slugId: 'platform-roadmap',
          sortOrder: 1,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
          updatedAt: new Date('2024-01-02T00:00:00.000Z'),
          archivedAt: null,
          url: 'https://linear.app/roadmap/1',
          owner: Promise.resolve({ id: 'user-1', name: 'Owner', email: 'owner@example.com' }),
          creator: Promise.resolve({ id: 'user-2', name: 'Creator', email: 'creator@example.com' }),
        },
      ],
    });

    const service = new LinearService({
      organization: Promise.resolve({ id: 'org-1', name: 'Premier Studio', roadmapEnabled: true }),
      roadmaps,
    } as never);

    await expect(service.getRoadmaps({ limit: 10, includeArchived: true })).resolves.toEqual([
      {
        id: 'roadmap-1',
        name: 'Platform Roadmap',
        description: 'Quarterly priorities',
        color: '#123456',
        slugId: 'platform-roadmap',
        sortOrder: 1,
        owner: { id: 'user-1', name: 'Owner', email: 'owner@example.com' },
        creator: { id: 'user-2', name: 'Creator', email: 'creator@example.com' },
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-02T00:00:00.000Z'),
        archivedAt: null,
        url: 'https://linear.app/roadmap/1',
      },
    ]);

    expect(roadmaps).toHaveBeenCalledWith({ first: 10, includeArchived: true });
  });

  it('returns roadmap details with associated projects', async () => {
    const roadmap = jest.fn().mockResolvedValue({
      id: 'roadmap-1',
      name: 'Platform Roadmap',
      description: 'Quarterly priorities',
      color: '#123456',
      slugId: 'platform-roadmap',
      sortOrder: 1,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      archivedAt: null,
      url: 'https://linear.app/roadmap/1',
      owner: Promise.resolve({ id: 'user-1', name: 'Owner', email: 'owner@example.com' }),
      creator: Promise.resolve({ id: 'user-2', name: 'Creator', email: 'creator@example.com' }),
      projects: jest.fn().mockResolvedValue({
        nodes: [
          {
            id: 'project-1',
            name: 'Core App',
            state: 'started',
            url: 'https://linear.app/project/1',
          },
        ],
      }),
    });

    const service = new LinearService({
      organization: Promise.resolve({ id: 'org-1', name: 'Premier Studio', roadmapEnabled: true }),
      roadmap,
    } as never);

    await expect(service.getRoadmapById('roadmap-1')).resolves.toMatchObject({
      id: 'roadmap-1',
      projects: [
        {
          id: 'project-1',
          name: 'Core App',
          state: 'started',
          url: 'https://linear.app/project/1',
        },
      ],
    });
  });

  it('creates, updates, and archives a roadmap', async () => {
    const archiveRoadmapMutation = jest.fn().mockResolvedValue({ success: true, entity: Promise.resolve(null) });
    const activeRoadmapRecord = {
      id: 'roadmap-1',
      name: 'Platform Roadmap',
      description: 'Quarterly priorities',
      color: '#123456',
      slugId: 'platform-roadmap',
      sortOrder: 1,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-02T00:00:00.000Z'),
      archivedAt: null,
      url: 'https://linear.app/roadmap/1',
      owner: Promise.resolve({ id: 'user-1', name: 'Owner', email: 'owner@example.com' }),
      creator: Promise.resolve({ id: 'user-2', name: 'Creator', email: 'creator@example.com' }),
      projects: jest.fn().mockResolvedValue({ nodes: [] }),
      archive: archiveRoadmapMutation,
    };
    const archivedRoadmapRecord = {
      ...activeRoadmapRecord,
      archivedAt: new Date('2024-01-03T00:00:00.000Z'),
    };

    const createRoadmap = jest.fn().mockResolvedValue({
      success: true,
      roadmap: Promise.resolve(activeRoadmapRecord),
    });
    const updateRoadmap = jest.fn().mockResolvedValue({
      success: true,
      roadmap: Promise.resolve(activeRoadmapRecord),
    });
    const roadmap = jest
      .fn()
      .mockResolvedValueOnce(activeRoadmapRecord)
      .mockResolvedValueOnce(activeRoadmapRecord)
      .mockResolvedValueOnce(archivedRoadmapRecord);

    const service = new LinearService({
      organization: Promise.resolve({ id: 'org-1', name: 'Premier Studio', roadmapEnabled: true }),
      createRoadmap,
      updateRoadmap,
      roadmap,
    } as never);

    await expect(service.createRoadmap({ name: 'Platform Roadmap', description: 'Quarterly priorities' }))
      .resolves.toMatchObject({ id: 'roadmap-1', projects: [] });
    expect(createRoadmap).toHaveBeenCalledWith({
      name: 'Platform Roadmap',
      description: 'Quarterly priorities',
    });

    await expect(service.updateRoadmap({ id: 'roadmap-1', color: '#123456' })).resolves.toMatchObject({
      id: 'roadmap-1',
      color: '#123456',
    });
    expect(updateRoadmap).toHaveBeenCalledWith('roadmap-1', { color: '#123456' });

    await expect(service.archiveRoadmap('roadmap-1')).resolves.toMatchObject({
      success: true,
      roadmap: {
        id: 'roadmap-1',
        archivedAt: new Date('2024-01-03T00:00:00.000Z'),
      },
    });
    expect(archiveRoadmapMutation).toHaveBeenCalled();
    expect(roadmap).toHaveBeenCalledTimes(3);
  });

  it('blocks roadmap operations when the workspace does not have roadmaps enabled', async () => {
    const service = new LinearService({
      organization: Promise.resolve({ id: 'org-1', name: 'Premier Studio', roadmapEnabled: false }),
      roadmaps: jest.fn(),
    } as never);

    await expect(service.getRoadmaps()).rejects.toThrow(
      'Roadmaps are not enabled for organization Premier Studio',
    );
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

describe('LinearService PM workflow queries', () => {
  it('builds project issue filters for PM views and normalizes issue summaries', async () => {
    const projectIssues = jest.fn().mockResolvedValue({
      nodes: [
        {
          id: 'issue-1',
          identifier: 'ORD-1',
          title: 'Refine onboarding',
          description: 'Polish the setup flow',
          priority: 2,
          estimate: 5,
          dueDate: '2026-04-20',
          sortOrder: 12,
          createdAt: new Date('2026-04-01T00:00:00.000Z'),
          updatedAt: new Date('2026-04-02T00:00:00.000Z'),
          url: 'https://linear.app/issue/ORD-1',
          state: Promise.resolve({ id: 'state-1', name: 'In Progress', color: '#f00', type: 'started' }),
          team: Promise.resolve({ id: 'team-1', name: 'Ordello' }),
          assignee: Promise.resolve({ id: 'user-1', name: 'Alex' }),
          cycle: Promise.resolve({ id: 'cycle-1', name: 'Sprint 1' }),
          projectMilestone: Promise.resolve({ id: 'milestone-1', name: 'Phase 1' }),
          labels: jest.fn().mockResolvedValue({ nodes: [{ id: 'label-1', name: 'frontend', color: '#0f0' }] }),
        },
      ],
    });
    const project = jest.fn().mockResolvedValue({
      id: 'project-1',
      issues: projectIssues,
    });
    const service = new LinearService({ project } as never);

    const result = await service.getProjectIssues({
      projectId: 'project-1',
      limit: 10,
      states: ['In Progress'],
      assigneeId: 'user-1',
      labelIds: ['label-1'],
      cycleId: 'cycle-1',
      projectMilestoneId: 'milestone-1',
      includeCompleted: false,
      orderBy: 'updatedAt',
    });

    expect(project).toHaveBeenCalledWith('project-1');
    expect(projectIssues).toHaveBeenCalledWith({
      first: 10,
      orderBy: 'updatedAt',
      filter: {
        assignee: { id: { eq: 'user-1' } },
        labels: { some: { id: { in: ['label-1'] } } },
        cycle: { id: { eq: 'cycle-1' } },
        projectMilestone: { id: { eq: 'milestone-1' } },
        completedAt: { null: true },
        state: { name: { in: ['In Progress'] } },
      },
    });
    expect(result).toEqual([
      expect.objectContaining({
        id: 'issue-1',
        identifier: 'ORD-1',
        state: { id: 'state-1', name: 'In Progress', color: '#f00', type: 'started' },
        labels: [{ id: 'label-1', name: 'frontend', color: '#0f0' }],
        cycle: { id: 'cycle-1', name: 'Sprint 1' },
        projectMilestone: { id: 'milestone-1', name: 'Phase 1' },
      }),
    ]);
  });

  it('filters milestones by project, team, and status for PM planning views', async () => {
    const projectMilestones = jest.fn().mockResolvedValue({
      nodes: [
        {
          id: 'milestone-1',
          name: 'Phase 1',
          description: 'Foundation',
          progress: 25,
          sortOrder: 1,
          targetDate: '2026-04-30',
          createdAt: new Date('2026-04-01T00:00:00.000Z'),
          updatedAt: new Date('2026-04-02T00:00:00.000Z'),
          status: 'next',
          project: Promise.resolve({ id: 'project-1', name: 'OrdelloTS' }),
        },
      ],
    });
    const teams = jest.fn().mockResolvedValue({ nodes: [{ id: 'team-1', name: 'Ordello' }] });
    const project = jest.fn().mockResolvedValue({
      id: 'project-1',
      teams,
      projectMilestones,
    });
    const service = new LinearService({ project } as never);

    const result = await service.getMilestones({
      projectId: 'project-1',
      teamId: 'team-1',
      status: 'next',
      limit: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });

    expect(project).toHaveBeenCalledWith('project-1');
    expect(projectMilestones).toHaveBeenCalledWith({
      first: 5,
      includeArchived: true,
      orderBy: 'updatedAt',
    });
    expect(result).toEqual([
      expect.objectContaining({
        id: 'milestone-1',
        status: 'next',
      }),
    ]);
  });

  it('builds cycle issue filters for PM cycle views', async () => {
    const cycleIssues = jest.fn().mockResolvedValue({
      nodes: [
        {
          id: 'issue-1',
          identifier: 'ORD-1',
          title: 'Refine onboarding',
          description: 'Polish the setup flow',
          priority: 2,
          estimate: 5,
          dueDate: '2026-04-20',
          sortOrder: 12,
          createdAt: new Date('2026-04-01T00:00:00.000Z'),
          updatedAt: new Date('2026-04-02T00:00:00.000Z'),
          url: 'https://linear.app/issue/ORD-1',
          state: Promise.resolve({ id: 'state-1', name: 'Todo', color: '#00f', type: 'unstarted' }),
          team: Promise.resolve({ id: 'team-1', name: 'Ordello' }),
          assignee: Promise.resolve({ id: 'user-1', name: 'Alex' }),
          cycle: Promise.resolve({ id: 'cycle-1', name: 'Sprint 1' }),
          projectMilestone: undefined,
          labels: jest.fn().mockResolvedValue({ nodes: [{ id: 'label-1', name: 'backend', color: '#0ff' }] }),
        },
      ],
    });
    const cycle = jest.fn().mockResolvedValue({
      id: 'cycle-1',
      issues: cycleIssues,
    });
    const service = new LinearService({ cycle } as never);

    const result = await service.getCycleIssues({
      cycleId: 'cycle-1',
      limit: 10,
      states: ['Todo'],
      assigneeId: 'user-1',
      labelIds: ['label-1'],
      includeCompleted: false,
      orderBy: 'createdAt',
    });

    expect(cycle).toHaveBeenCalledWith('cycle-1');
    expect(cycleIssues).toHaveBeenCalledWith({
      first: 10,
      orderBy: 'createdAt',
      filter: {
        assignee: { id: { eq: 'user-1' } },
        labels: { some: { id: { in: ['label-1'] } } },
        completedAt: { null: true },
        state: { name: { in: ['Todo'] } },
      },
    });
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'issue-1',
        state: { id: 'state-1', name: 'Todo', color: '#00f', type: 'unstarted' },
      }),
    );
  });
});
