import { LinearService } from '../services/linear-service.js';
import { allToolDefinitions } from '../tools/definitions/index.js';
import { registerToolHandlers } from '../tools/handlers/index.js';

describe('project update and archive MCP tools', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('registers the project update and archive tool definitions', () => {
    const toolNames = allToolDefinitions.map((tool) => tool.name);

    expect(toolNames).toEqual(
      expect.arrayContaining([
        'linear_createProjectUpdate',
        'linear_updateProjectUpdate',
        'linear_getProjectUpdates',
        'linear_archiveProject',
      ]),
    );
  });

  it('routes createProjectUpdate calls to the linear service', async () => {
    const createProjectUpdate = jest.fn().mockResolvedValue({ id: 'update-1' });
    const handlers = registerToolHandlers({ createProjectUpdate } as unknown as LinearService);

    await expect(
      handlers.linear_createProjectUpdate({
        projectId: 'project-1',
        body: 'Weekly update',
        health: 'onTrack',
        attachments: ['attachment-1'],
      }),
    ).resolves.toEqual({ id: 'update-1' });

    expect(createProjectUpdate).toHaveBeenCalledWith({
      projectId: 'project-1',
      body: 'Weekly update',
      health: 'onTrack',
      attachments: ['attachment-1'],
    });
  });

  it('routes updateProjectUpdate calls to the linear service', async () => {
    const updateProjectUpdate = jest.fn().mockResolvedValue({ id: 'update-1' });
    const handlers = registerToolHandlers({ updateProjectUpdate } as unknown as LinearService);

    await expect(
      handlers.linear_updateProjectUpdate({
        id: 'update-1',
        body: 'Adjusted update',
        health: 'atRisk',
      }),
    ).resolves.toEqual({ id: 'update-1' });

    expect(updateProjectUpdate).toHaveBeenCalledWith({
      id: 'update-1',
      body: 'Adjusted update',
      health: 'atRisk',
    });
  });

  it('routes getProjectUpdates calls to the linear service', async () => {
    const getProjectUpdates = jest.fn().mockResolvedValue([{ id: 'update-1' }]);
    const handlers = registerToolHandlers({ getProjectUpdates } as unknown as LinearService);

    await expect(
      handlers.linear_getProjectUpdates({
        projectId: 'project-1',
        limit: 10,
      }),
    ).resolves.toEqual([{ id: 'update-1' }]);

    expect(getProjectUpdates).toHaveBeenCalledWith('project-1', 10);
  });

  it('routes archiveProject calls to the linear service', async () => {
    const archiveProject = jest.fn().mockResolvedValue({ success: true });
    const handlers = registerToolHandlers({ archiveProject } as unknown as LinearService);

    await expect(
      handlers.linear_archiveProject({
        projectId: 'project-1',
      }),
    ).resolves.toEqual({ success: true });

    expect(archiveProject).toHaveBeenCalledWith('project-1');
  });

  it('rejects invalid project update and archive arguments', async () => {
    const handlers = registerToolHandlers({} as unknown as LinearService);

    await expect(
      handlers.linear_createProjectUpdate({
        projectId: 'project-1',
      }),
    ).rejects.toThrow('Invalid arguments for createProjectUpdate');

    await expect(
      handlers.linear_updateProjectUpdate({
        body: 'Missing id',
      }),
    ).rejects.toThrow('Invalid arguments for updateProjectUpdate');

    await expect(
      handlers.linear_getProjectUpdates({
        limit: 5,
      }),
    ).rejects.toThrow('Invalid arguments for getProjectUpdates');

    await expect(handlers.linear_archiveProject({})).rejects.toThrow(
      'Invalid arguments for archiveProject',
    );
  });
});
