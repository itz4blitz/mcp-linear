import { LinearService } from '../../services/linear-service.js';
import {
  handleGetIssues,
  handleGetIssueById,
  handleGetCustomFields,
  handleGetIssueCustomFields,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleUpdateIssueCustomField,
  handleCreateComment,
  handleAddIssueLabel,
  handleRemoveIssueLabel,
  // New Issue Management handlers
  handleAssignIssue,
  handleSubscribeToIssue,
  handleConvertIssueToSubtask,
  handleCreateIssueRelation,
  handleArchiveIssue,
  handleSetIssuePriority,
  handleTransferIssue,
  handleDuplicateIssue,
  handleGetIssueHistory,
  // Comment Management handlers
  handleGetComments,
} from './issue-handlers.js';
import {
  handleGetProjects,
  handleCreateProject,
  // Project Management handlers
  handleUpdateProject,
  handleCreateProjectUpdate,
  handleUpdateProjectUpdate,
  handleGetProjectUpdates,
  handleArchiveProject,
  handleAddIssueToProject,
  handleRemoveIssueFromProject,
  handleGetProjectIssues,
} from './project-handlers.js';
import {
  handleArchiveRoadmap,
  handleCreateRoadmap,
  handleGetRoadmapById,
  handleGetRoadmaps,
  handleUpdateRoadmap,
} from './roadmap-handlers.js';
import {
  handleArchiveMilestone,
  handleCreateMilestone,
  handleGetMilestoneById,
  handleGetMilestones,
  handleUpdateMilestone,
} from './milestone-handlers.js';
import {
  handleAddToFavorites,
  handleCreateSavedView,
  handleDeleteSavedView,
  handleGetFavoriteViews,
  handleGetSavedViews,
  handleRemoveFromFavorites,
  handleUpdateSavedView,
} from './view-handlers.js';
import { handleGetTeams, handleGetWorkflowStates } from './team-handlers.js';
import {
  handleGetViewer,
  handleGetOrganization,
  handleGetUsers,
  handleGetLabels,
} from './user-handlers.js';
import {
  // Cycle Management handlers
  handleGetCycles,
  handleGetActiveCycle,
  handleGetCycleIssues,
  handleAddIssueToCycle,
  handleRemoveIssueFromCycle,
} from './cycle-handlers.js';
import {
  // Initiative Management handlers
  getInitiativesHandler,
  getInitiativeByIdHandler,
  createInitiativeHandler,
  updateInitiativeHandler,
  archiveInitiativeHandler,
  unarchiveInitiativeHandler,
  deleteInitiativeHandler,
  getInitiativeProjectsHandler,
  addProjectToInitiativeHandler,
  removeProjectFromInitiativeHandler,
} from './initiative-handlers.js';

/**
 * Registers all tool handlers for the MCP Linear
 * @param linearService The Linear service instance
 * @returns A map of tool name to handler function
 */
export function registerToolHandlers(linearService: LinearService) {
  return {
    // User tools
    linear_getViewer: handleGetViewer(linearService),
    linear_getOrganization: handleGetOrganization(linearService),
    linear_getUsers: handleGetUsers(linearService),
    linear_getLabels: handleGetLabels(linearService),

    // Team tools
    linear_getTeams: handleGetTeams(linearService),
    linear_getWorkflowStates: handleGetWorkflowStates(linearService),

    // Project tools
    linear_getProjects: handleGetProjects(linearService),
    linear_createProject: handleCreateProject(linearService),

    // Project Management tools
    linear_updateProject: handleUpdateProject(linearService),
    linear_createProjectUpdate: handleCreateProjectUpdate(linearService),
    linear_updateProjectUpdate: handleUpdateProjectUpdate(linearService),
    linear_getProjectUpdates: handleGetProjectUpdates(linearService),
    linear_archiveProject: handleArchiveProject(linearService),
    linear_addIssueToProject: handleAddIssueToProject(linearService),
    linear_removeIssueFromProject: handleRemoveIssueFromProject(linearService),
    linear_getProjectIssues: handleGetProjectIssues(linearService),

    // Roadmap tools
    linear_getRoadmaps: handleGetRoadmaps(linearService),
    linear_getRoadmapById: handleGetRoadmapById(linearService),
    linear_createRoadmap: handleCreateRoadmap(linearService),
    linear_updateRoadmap: handleUpdateRoadmap(linearService),
    linear_archiveRoadmap: handleArchiveRoadmap(linearService),

    // Milestone tools
    linear_getMilestones: handleGetMilestones(linearService),
    linear_getMilestoneById: handleGetMilestoneById(linearService),
    linear_createMilestone: handleCreateMilestone(linearService),
    linear_updateMilestone: handleUpdateMilestone(linearService),
    linear_archiveMilestone: handleArchiveMilestone(linearService),

    // View tools
    linear_getSavedViews: handleGetSavedViews(linearService),
    linear_createSavedView: handleCreateSavedView(linearService),
    linear_updateSavedView: handleUpdateSavedView(linearService),
    linear_deleteSavedView: handleDeleteSavedView(linearService),
    linear_getFavoriteViews: handleGetFavoriteViews(linearService),
    linear_addToFavorites: handleAddToFavorites(linearService),
    linear_removeFromFavorites: handleRemoveFromFavorites(linearService),

    // Cycle Management tools
    linear_getCycles: handleGetCycles(linearService),
    linear_getActiveCycle: handleGetActiveCycle(linearService),
    linear_getCycleIssues: handleGetCycleIssues(linearService),
    linear_addIssueToCycle: handleAddIssueToCycle(linearService),
    linear_removeIssueFromCycle: handleRemoveIssueFromCycle(linearService),

    // Initiative Management tools
    linear_getInitiatives: getInitiativesHandler(linearService),
    linear_getInitiativeById: getInitiativeByIdHandler(linearService),
    linear_createInitiative: createInitiativeHandler(linearService),
    linear_updateInitiative: updateInitiativeHandler(linearService),
    linear_archiveInitiative: archiveInitiativeHandler(linearService),
    linear_unarchiveInitiative: unarchiveInitiativeHandler(linearService),
    linear_deleteInitiative: deleteInitiativeHandler(linearService),
    linear_getInitiativeProjects: getInitiativeProjectsHandler(linearService),
    linear_addProjectToInitiative: addProjectToInitiativeHandler(linearService),
    linear_removeProjectFromInitiative: removeProjectFromInitiativeHandler(linearService),

    // Issue tools
    linear_getIssues: handleGetIssues(linearService),
    linear_getIssueById: handleGetIssueById(linearService),
    linear_getCustomFields: handleGetCustomFields(linearService),
    linear_getIssueCustomFields: handleGetIssueCustomFields(linearService),
    linear_searchIssues: handleSearchIssues(linearService),
    linear_createIssue: handleCreateIssue(linearService),
    linear_updateIssue: handleUpdateIssue(linearService),
    linear_updateIssueCustomField: handleUpdateIssueCustomField(linearService),
    linear_createComment: handleCreateComment(linearService),
    linear_addIssueLabel: handleAddIssueLabel(linearService),
    linear_removeIssueLabel: handleRemoveIssueLabel(linearService),

    // New Issue Management tools
    linear_assignIssue: handleAssignIssue(linearService),
    linear_subscribeToIssue: handleSubscribeToIssue(linearService),
    linear_convertIssueToSubtask: handleConvertIssueToSubtask(linearService),
    linear_createIssueRelation: handleCreateIssueRelation(linearService),
    linear_archiveIssue: handleArchiveIssue(linearService),
    linear_setIssuePriority: handleSetIssuePriority(linearService),
    linear_transferIssue: handleTransferIssue(linearService),
    linear_duplicateIssue: handleDuplicateIssue(linearService),
    linear_getIssueHistory: handleGetIssueHistory(linearService),

    // Comment Management tools
    linear_getComments: handleGetComments(linearService),
  };
}

// Export all handlers individually
export {
  handleGetIssues,
  handleGetIssueById,
  handleGetCustomFields,
  handleGetIssueCustomFields,
  handleSearchIssues,
  handleCreateIssue,
  handleUpdateIssue,
  handleUpdateIssueCustomField,
  handleCreateComment,
  handleAddIssueLabel,
  handleRemoveIssueLabel,
  handleGetProjects,
  handleCreateProject,
  handleGetTeams,
  handleGetWorkflowStates,
  handleGetViewer,
  handleGetOrganization,
  handleGetUsers,
  handleGetLabels,

  // New Issue Management handlers
  handleAssignIssue,
  handleSubscribeToIssue,
  handleConvertIssueToSubtask,
  handleCreateIssueRelation,
  handleArchiveIssue,
  handleSetIssuePriority,
  handleTransferIssue,
  handleDuplicateIssue,
  handleGetIssueHistory,

  // Comment Management handlers
  handleGetComments,

  // Roadmap handlers
  handleGetRoadmaps,
  handleGetRoadmapById,
  handleCreateRoadmap,
  handleUpdateRoadmap,
  handleArchiveRoadmap,

  // Project Management handlers
  handleUpdateProject,
  handleCreateProjectUpdate,
  handleUpdateProjectUpdate,
  handleGetProjectUpdates,
  handleArchiveProject,
  handleAddIssueToProject,
  handleRemoveIssueFromProject,
  handleGetProjectIssues,

  // Milestone handlers
  handleGetMilestones,
  handleGetMilestoneById,
  handleCreateMilestone,
  handleUpdateMilestone,
  handleArchiveMilestone,

  // View handlers
  handleGetSavedViews,
  handleCreateSavedView,
  handleUpdateSavedView,
  handleDeleteSavedView,
  handleGetFavoriteViews,
  handleAddToFavorites,
  handleRemoveFromFavorites,

  // Cycle Management handlers
  handleGetCycles,
  handleGetActiveCycle,
  handleGetCycleIssues,
  handleAddIssueToCycle,
  handleRemoveIssueFromCycle,

  // Initiative Management handlers
  getInitiativesHandler,
  getInitiativeByIdHandler,
  createInitiativeHandler,
  updateInitiativeHandler,
  archiveInitiativeHandler,
  unarchiveInitiativeHandler,
  deleteInitiativeHandler,
  getInitiativeProjectsHandler,
  addProjectToInitiativeHandler,
  removeProjectFromInitiativeHandler,
};
