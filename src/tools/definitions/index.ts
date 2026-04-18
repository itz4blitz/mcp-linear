import { MCPToolDefinition } from '../../types.js';
import {
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,
  // Comment Management tools
  getCommentsToolDefinition,
} from './issue-tools.js';
import {
  getProjectsToolDefinition,
  createProjectToolDefinition,
  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,
} from './project-tools.js';
import {
  createSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,
  getSavedViewsToolDefinition,
  updateSavedViewToolDefinition,
} from './view-tools.js';
import { getTeamsToolDefinition, getWorkflowStatesToolDefinition } from './team-tools.js';
import {
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,
} from './user-tools.js';
import {
  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,
} from './cycle-tools.js';
import { initiativeToolDefinitions } from './initiative-tools.js';

// All tool definitions
export const allToolDefinitions: MCPToolDefinition[] = [
  // User tools
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,

  // Team tools
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,

  // Project tools
  getProjectsToolDefinition,
  createProjectToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,

  // View tools
  getSavedViewsToolDefinition,
  createSavedViewToolDefinition,
  updateSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,

  // Initiative Management tools
  ...initiativeToolDefinitions,

  // Issue tools
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,

  // Comment Management tools
  getCommentsToolDefinition,
];

// Export all tool definitions individually
export {
  getIssuesToolDefinition,
  getIssueByIdToolDefinition,
  getCustomFieldsToolDefinition,
  getIssueCustomFieldsToolDefinition,
  searchIssuesToolDefinition,
  createIssueToolDefinition,
  updateIssueToolDefinition,
  updateIssueCustomFieldToolDefinition,
  createCommentToolDefinition,
  addIssueLabelToolDefinition,
  removeIssueLabelToolDefinition,
  getProjectsToolDefinition,
  createProjectToolDefinition,
  getTeamsToolDefinition,
  getWorkflowStatesToolDefinition,
  getViewerToolDefinition,
  getOrganizationToolDefinition,
  getUsersToolDefinition,
  getLabelsToolDefinition,

  // New Issue Management tools
  assignIssueToolDefinition,
  subscribeToIssueToolDefinition,
  convertIssueToSubtaskToolDefinition,
  createIssueRelationToolDefinition,
  archiveIssueToolDefinition,
  setIssuePriorityToolDefinition,
  transferIssueToolDefinition,
  duplicateIssueToolDefinition,
  getIssueHistoryToolDefinition,

  // Comment Management tools
  getCommentsToolDefinition,

  // Project Management tools
  updateProjectToolDefinition,
  createProjectUpdateToolDefinition,
  updateProjectUpdateToolDefinition,
  getProjectUpdatesToolDefinition,
  archiveProjectToolDefinition,
  addIssueToProjectToolDefinition,
  removeIssueFromProjectToolDefinition,
  getProjectIssuesToolDefinition,

  // View tools
  getSavedViewsToolDefinition,
  createSavedViewToolDefinition,
  updateSavedViewToolDefinition,
  deleteSavedViewToolDefinition,
  getFavoriteViewsToolDefinition,

  // Cycle Management tools
  getCyclesToolDefinition,
  getActiveCycleToolDefinition,
  addIssueToCycleToolDefinition,
  removeIssueFromCycleToolDefinition,
};
