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
