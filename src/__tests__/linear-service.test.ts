import { LinearService } from '../services/linear-service.js';

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
});
