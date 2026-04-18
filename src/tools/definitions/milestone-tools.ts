import { MCPToolDefinition } from '../../types.js';

export const getMilestonesToolDefinition: MCPToolDefinition = {
  name: 'linear_getMilestones',
  description: 'Get a list of project milestones from Linear',
  input_schema: {
    type: 'object',
    properties: {
      includeArchived: {
        type: 'boolean',
        description: 'Include archived milestones in the results',
        default: false,
      },
      limit: {
        type: 'integer',
        minimum: 1,
        description: 'Maximum number of milestones to return',
        default: 50,
      },
    },
  },
  output_schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        description: { type: ['string', 'null'] },
        status: { type: 'string' },
        progress: { type: 'number' },
        sortOrder: { type: 'number' },
        targetDate: { type: ['string', 'null'] },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
        archivedAt: { type: ['string', 'null'] },
        project: {
          type: ['object', 'null'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
      },
    },
  },
};

export const getMilestoneByIdToolDefinition: MCPToolDefinition = {
  name: 'linear_getMilestoneById',
  description: 'Get details of a specific project milestone by ID',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'The ID of the milestone to retrieve',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      status: { type: 'string' },
      progress: { type: 'number' },
      sortOrder: { type: 'number' },
      targetDate: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      archivedAt: { type: ['string', 'null'] },
      project: {
        type: ['object', 'null'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

export const createMilestoneToolDefinition: MCPToolDefinition = {
  name: 'linear_createMilestone',
  description: 'Create a new project milestone in Linear',
  input_schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Name of the milestone',
      },
      projectId: {
        type: 'string',
        description: 'ID of the project the milestone belongs to',
      },
      description: {
        type: 'string',
        description: 'Description of the milestone in markdown format',
      },
      targetDate: {
        type: 'string',
        description: 'Planned target date for the milestone (YYYY-MM-DD format)',
      },
      sortOrder: {
        type: 'number',
        description: 'Sort order for the milestone within its project',
      },
    },
    required: ['name', 'projectId'],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      status: { type: 'string' },
      progress: { type: 'number' },
      sortOrder: { type: 'number' },
      targetDate: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      archivedAt: { type: ['string', 'null'] },
      project: {
        type: ['object', 'null'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

export const updateMilestoneToolDefinition: MCPToolDefinition = {
  name: 'linear_updateMilestone',
  description: 'Update an existing project milestone in Linear',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the milestone to update',
      },
      name: {
        type: 'string',
        description: 'Updated name of the milestone',
      },
      projectId: {
        type: 'string',
        description: 'Updated project ID for the milestone',
      },
      description: {
        type: 'string',
        description: 'Updated milestone description in markdown format',
      },
      targetDate: {
        type: 'string',
        description: 'Updated planned target date for the milestone (YYYY-MM-DD format)',
      },
      sortOrder: {
        type: 'number',
        description: 'Updated sort order for the milestone within its project',
      },
    },
    required: ['id'],
    anyOf: [
      { required: ['name'] },
      { required: ['projectId'] },
      { required: ['description'] },
      { required: ['targetDate'] },
      { required: ['sortOrder'] },
    ],
  },
  output_schema: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      description: { type: ['string', 'null'] },
      status: { type: 'string' },
      progress: { type: 'number' },
      sortOrder: { type: 'number' },
      targetDate: { type: ['string', 'null'] },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      archivedAt: { type: ['string', 'null'] },
      project: {
        type: ['object', 'null'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

export const archiveMilestoneToolDefinition: MCPToolDefinition = {
  name: 'linear_archiveMilestone',
  description: 'Archive a project milestone',
  input_schema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'ID of the milestone to archive',
      },
    },
    required: ['id'],
  },
  output_schema: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      milestone: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      },
    },
  },
};

export const milestoneToolDefinitions: MCPToolDefinition[] = [
  getMilestonesToolDefinition,
  getMilestoneByIdToolDefinition,
  createMilestoneToolDefinition,
  updateMilestoneToolDefinition,
  archiveMilestoneToolDefinition,
];
