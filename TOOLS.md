# MCP Linear Tools

This document provides an overview of all tools implemented in the MCP Linear, as well as recommendations for future development.

## Implemented Tools

The following tools are currently implemented and available in the MCP Linear:

### User & Organization Tools

| Tool Name                | Description                                            | Status         |
| ------------------------ | ------------------------------------------------------ | -------------- |
| `linear_getViewer`       | Get information about the currently authenticated user | ✅ Implemented |
| `linear_getOrganization` | Get information about the current Linear organization  | ✅ Implemented |
| `linear_getUsers`        | Get a list of users in the Linear organization         | ✅ Implemented |
| `linear_getLabels`       | Get a list of issue labels from Linear                 | ✅ Implemented |

### Team Tools

| Tool Name         | Description                     | Status         |
| ----------------- | ------------------------------- | -------------- |
| `linear_getTeams` | Get a list of teams from Linear | ✅ Implemented |

### Project Tools

| Tool Name              | Description                        | Status         |
| ---------------------- | ---------------------------------- | -------------- |
| `linear_getProjects`   | Get a list of projects from Linear | ✅ Implemented |
| `linear_createProject` | Create a new project in Linear     | ✅ Implemented |

### Issue Tools

| Tool Name                 | Description                                              | Status         |
| ------------------------- | -------------------------------------------------------- | -------------- |
| `linear_getIssues`        | Get a list of recent issues from Linear                  | ✅ Implemented |
| `linear_getIssueById`     | Get a specific issue by ID or identifier (e.g., ABC-123) | ✅ Implemented |
| `linear_searchIssues`     | Search for issues with various filters                   | ✅ Implemented |
| `linear_createIssue`      | Create a new issue in Linear                             | ✅ Implemented |
| `linear_updateIssue`      | Update an existing issue in Linear                       | ✅ Implemented |
| `linear_createComment`    | Add a comment to an issue in Linear                      | ✅ Implemented |
| `linear_addIssueLabel`    | Add a label to an issue                                  | ✅ Implemented |
| `linear_removeIssueLabel` | Remove a label from an issue                             | ✅ Implemented |

### Issue Management Tools

| Tool Name                      | Description                                                   | Status         |
| ------------------------------ | ------------------------------------------------------------- | -------------- |
| `linear_assignIssue`           | Assign an issue to a user                                     | ✅ Implemented |
| `linear_subscribeToIssue`      | Subscribe to issue updates                                    | 🔄 In Progress |
| `linear_convertIssueToSubtask` | Convert an issue to a subtask                                 | ✅ Implemented |
| `linear_createIssueRelation`   | Create relations between issues (blocks, is blocked by, etc.) | 🔄 In Progress |
| `linear_archiveIssue`          | Archive an issue                                              | ✅ Implemented |
| `linear_setIssuePriority`      | Set the priority of an issue                                  | ✅ Implemented |
| `linear_transferIssue`         | Transfer an issue to another team                             | ✅ Implemented |
| `linear_duplicateIssue`        | Duplicate an issue                                            | ✅ Implemented |
| `linear_getIssueHistory`       | Get the history of changes made to an issue                   | ✅ Implemented |

### Custom Field Tools

| Tool Name                       | Description                                                                              | Status         |
| ------------------------------- | ---------------------------------------------------------------------------------------- | -------------- |
| `linear_getCustomFields`        | Get the custom field definitions exposed by the authenticated Linear schema              | ✅ Implemented |
| `linear_getIssueCustomFields`   | Get the custom field values currently set on an issue                                    | ✅ Implemented |
| `linear_updateIssueCustomField` | Update or clear a custom field value on an issue with JSON-compatible input and null clearing | ✅ Implemented |

### Comment Management Tools

| Tool Name            | Description                   | Status         |
| -------------------- | ----------------------------- | -------------- |
| `linear_getComments` | Get all comments for an issue | ✅ Implemented |

### Project Management Tools

| Tool Name                       | Description                               | Status         |
| ------------------------------- | ----------------------------------------- | -------------- |
| `linear_updateProject`          | Update an existing project                | ✅ Implemented |
| `linear_createProjectUpdate`    | Create a new update for a project         | ✅ Implemented |
| `linear_updateProjectUpdate`    | Update an existing project update         | ✅ Implemented |
| `linear_getProjectUpdates`      | Get updates for a project                 | ✅ Implemented |
| `linear_archiveProject`         | Archive a project                         | ✅ Implemented |
| `linear_addIssueToProject`      | Add an existing issue to a project        | ✅ Implemented |
| `linear_removeIssueFromProject` | Remove an existing issue from a project   | ✅ Implemented |
| `linear_getProjectIssues`       | Get all issues associated with a project  | ✅ Implemented |

### Cycle Management Tools

| Tool Name                | Description                               | Status         |
| ------------------------ | ----------------------------------------- | -------------- |
| `linear_getCycles`       | Get a list of all cycles                  | ✅ Implemented |
| `linear_getActiveCycle`  | Get the currently active cycle for a team | ✅ Implemented |
| `linear_addIssueToCycle` | Add an issue to a cycle                   | ✅ Implemented |
| `linear_removeIssueFromCycle` | Remove an issue from a cycle          | ✅ Implemented |

### Initiative Management Tools

| Tool Name                            | Description                                                         | Status         |
| ------------------------------------ | ------------------------------------------------------------------- | -------------- |
| `linear_getInitiatives`              | Get a list of initiatives from Linear                               | ✅ Implemented |
| `linear_getInitiativeById`           | Get details of a specific initiative                                | ✅ Implemented |
| `linear_createInitiative`            | Create a new initiative                                             | ✅ Implemented |
| `linear_updateInitiative`            | Update an existing initiative                                       | ✅ Implemented |
| `linear_archiveInitiative`           | Archive an initiative                                               | ✅ Implemented |
| `linear_unarchiveInitiative`         | Unarchive an initiative                                             | ✅ Implemented |
| `linear_deleteInitiative`            | Delete an initiative (move to trash)                                | ✅ Implemented |
| `linear_getInitiativeProjects`       | Get all projects in an initiative                                   | ✅ Implemented |
| `linear_addProjectToInitiative`      | Add a project to an initiative                                      | ✅ Implemented |
| `linear_removeProjectFromInitiative` | Remove a project from an initiative                                 | ✅ Implemented |

### Views and Filters

Linear calls these "saved views" in the product UI. The GraphQL API and SDK expose the same feature as `CustomView`.

| Tool Name                 | Description                                                                     | Status         |
| ------------------------- | ------------------------------------------------------------------------------- | -------------- |
| `linear_getSavedViews`    | Get Linear saved views (`CustomView` in the API/SDK)                            | ✅ Implemented |
| `linear_createSavedView`  | Create a new Linear saved view (`createCustomView` in the API/SDK)              | ✅ Implemented |
| `linear_updateSavedView`  | Update a Linear saved view (`updateCustomView` in the API/SDK)                  | ✅ Implemented |
| `linear_deleteSavedView`  | Delete a Linear saved view (`deleteCustomView` in the API/SDK)                  | ✅ Implemented |
| `linear_getFavoriteViews` | Get favorite views, including both saved/custom views and predefined Linear views | ✅ Implemented |

## Recommended Future Tools

The following tools are recommended for future implementation to enhance the capabilities of the MCP Linear:

### Comment Management

| Tool Name              | Description                | Priority | Status     |
| ---------------------- | -------------------------- | -------- | ---------- |
| `linear_updateComment` | Update an existing comment | Medium   | 📝 Planned |
| `linear_deleteComment` | Delete a comment           | Low      | 📝 Planned |

### Project Management

| Tool Name                       | Description                       | Priority | Status     |
| ------------------------------- | --------------------------------- | -------- | ---------- |
| `linear_getProjectMembers`      | Get members assigned to a project | Medium   | 📝 Planned |
| `linear_addProjectMember`       | Add a member to a project         | Medium   | 📝 Planned |
| `linear_removeProjectMember`    | Remove a member from a project    | Medium   | 📝 Planned |

### Cycle Management

| Tool Name                     | Description                     | Priority | Status     |
| ----------------------------- | ------------------------------- | -------- | ---------- |
| `linear_getCycleById`         | Get details of a specific cycle | Medium   | 📝 Planned |
| `linear_createCycle`          | Create a new cycle              | Medium   | 📝 Planned |
| `linear_updateCycle`          | Update an existing cycle        | Medium   | 📝 Planned |
| `linear_completeCycle`        | Mark a cycle as complete        | Medium   | 📝 Planned |
| `linear_getCycleStats`        | Get statistics for a cycle      | Medium   | 📝 Planned |

### Milestone Management

| Tool Name                           | Description                              | Priority | Status     |
| ----------------------------------- | ---------------------------------------- | -------- | ---------- |
| `linear_getMilestones`              | Get a list of milestones                 | Medium   | 📝 Planned |
| `linear_getMilestoneById`           | Get details of a specific milestone      | Medium   | 📝 Planned |
| `linear_createMilestone`            | Create a new milestone                   | Medium   | 📝 Planned |
| `linear_updateMilestone`            | Update an existing milestone             | Low      | 📝 Planned |
| `linear_archiveMilestone`           | Archive a milestone                      | Low      | 📝 Planned |
| `linear_getMilestoneProjects`       | Get projects associated with a milestone | Medium   | 📝 Planned |
| `linear_addProjectToMilestone`      | Add a project to a milestone             | Medium   | 📝 Planned |
| `linear_removeProjectFromMilestone` | Remove a project from a milestone        | Low      | 📝 Planned |

### Roadmap Tools

| Tool Name                      | Description                       | Priority | Status     |
| ------------------------------ | --------------------------------- | -------- | ---------- |
| `linear_getRoadmaps`           | Get a list of roadmaps            | Medium   | 📝 Planned |
| `linear_getRoadmapById`        | Get details of a specific roadmap | Medium   | 📝 Planned |
| `linear_createRoadmap`         | Create a new roadmap              | Medium   | 📝 Planned |
| `linear_updateRoadmap`         | Update an existing roadmap        | Low      | 📝 Planned |
| `linear_archiveRoadmap`        | Archive a roadmap                 | Low      | 📝 Planned |
| `linear_getRoadmapItems`       | Get items in a roadmap            | Medium   | 📝 Planned |
| `linear_addItemToRoadmap`      | Add an item to a roadmap          | Medium   | 📝 Planned |
| `linear_removeItemFromRoadmap` | Remove an item from a roadmap     | Low      | 📝 Planned |

### Workflow Management

| Tool Name                      | Description                             | Priority | Status         |
| ------------------------------ | --------------------------------------- | -------- | -------------- |
| `linear_getWorkflowStates`     | Get all workflow states                 | Medium   | ✅ Implemented |
| `linear_createWorkflowState`   | Create a new workflow state             | Low      | 📝 Planned     |
| `linear_updateWorkflowState`   | Update a workflow state                 | Low      | 📝 Planned     |
| `linear_getTeamStates`         | Get workflow states for a specific team | Medium   | 📝 Planned     |
| `linear_reorderWorkflowStates` | Change the order of workflow states     | Low      | 📝 Planned     |

### Team Management

| Tool Name                     | Description                    | Priority | Status     |
| ----------------------------- | ------------------------------ | -------- | ---------- |
| `linear_updateTeam`           | Update team settings           | Medium   | 📝 Planned |
| `linear_getTeamMemberships`   | Get team memberships           | Medium   | 📝 Planned |
| `linear_createTeam`           | Create a new team              | Medium   | 📝 Planned |
| `linear_archiveTeam`          | Archive a team                 | Low      | 📝 Planned |
| `linear_addUserToTeam`        | Add a user to a team           | Medium   | 📝 Planned |
| `linear_removeUserFromTeam`   | Remove a user from a team      | Medium   | 📝 Planned |
| `linear_updateTeamMembership` | Update a user's role in a team | Medium   | 📝 Planned |
| `linear_getTeamLabels`        | Get labels for a specific team | Medium   | 📝 Planned |
| `linear_createTeamLabel`      | Create a new label for a team  | Medium   | 📝 Planned |

### Custom Fields

| Tool Name                       | Description                              | Priority | Status     |
| ------------------------------- | ---------------------------------------- | -------- | ---------- |
| `linear_getCustomFields`        | Get a list of custom fields              | Medium   | ✅ Implemented |
| `linear_createCustomField`      | Create a new custom field                | Low      | 📝 Planned |
| `linear_updateCustomField`      | Update a custom field                    | Low      | 📝 Planned |
| `linear_getIssueCustomFields`   | Get custom field values for an issue     | Medium   | ✅ Implemented |
| `linear_updateIssueCustomField` | Update a custom field value for an issue | Medium   | ✅ Implemented |
| `linear_getTeamCustomFields`    | Get custom fields for a specific team    | Medium   | 📝 Planned |
| `linear_deleteCustomField`      | Delete a custom field                    | Low      | 📝 Planned |

### Issue Templates

| Tool Name                        | Description                              | Priority | Status     |
| -------------------------------- | ---------------------------------------- | -------- | ---------- |
| `linear_getIssueTemplates`       | Get a list of issue templates            | Medium   | 📝 Planned |
| `linear_getIssueTemplateById`    | Get details of a specific issue template | Medium   | 📝 Planned |
| `linear_createIssueTemplate`     | Create a new issue template              | Medium   | 📝 Planned |
| `linear_updateIssueTemplate`     | Update an existing issue template        | Low      | 📝 Planned |
| `linear_createIssueFromTemplate` | Create a new issue from a template       | High     | 📝 Planned |
| `linear_getTeamTemplates`        | Get templates for a specific team        | Medium   | 📝 Planned |
| `linear_archiveTemplate`         | Archive an issue template                | Low      | 📝 Planned |

### Import and Export

| Tool Name                 | Description                            | Priority | Status     |
| ------------------------- | -------------------------------------- | -------- | ---------- |
| `linear_bulkCreateIssues` | Create multiple issues at once         | Medium   | 📝 Planned |
| `linear_exportIssues`     | Export issues to a structured format   | Low      | 📝 Planned |
| `linear_importIssues`     | Import issues from a structured format | Low      | 📝 Planned |
| `linear_importCsvData`    | Import data from CSV                   | Low      | 📝 Planned |

### Integration Tools

| Tool Name                  | Description                             | Priority | Status     |
| -------------------------- | --------------------------------------- | -------- | ---------- |
| `linear_createWebhook`     | Create a webhook for integration events | Low      | 📝 Planned |
| `linear_getAttachments`    | Get attachments for an issue            | Medium   | 📝 Planned |
| `linear_addAttachment`     | Add an attachment to an issue           | Medium   | 📝 Planned |
| `linear_getIntegrations`   | Get a list of active integrations       | Low      | 📝 Planned |
| `linear_createIntegration` | Create a new integration                | Low      | 📝 Planned |
| `linear_removeIntegration` | Remove an integration                   | Low      | 📝 Planned |
| `linear_getWebhooks`       | Get a list of webhooks                  | Low      | 📝 Planned |
| `linear_deleteWebhook`     | Delete a webhook                        | Low      | 📝 Planned |

### Notifications and Subscriptions

| Tool Name                           | Description                             | Priority | Status     |
| ----------------------------------- | --------------------------------------- | -------- | ---------- |
| `linear_getNotifications`           | Get notifications for the current user  | Medium   | 📝 Planned |
| `linear_markNotificationAsRead`     | Mark a notification as read             | Medium   | 📝 Planned |
| `linear_getSubscriptions`           | Get subscriptions for the current user  | Low      | 📝 Planned |
| `linear_manageSubscription`         | Subscribe or unsubscribe from an entity | Low      | 📝 Planned |
| `linear_markAllNotificationsAsRead` | Mark all notifications as read          | Medium   | 📝 Planned |
| `linear_getUnreadNotificationCount` | Get count of unread notifications       | Medium   | 📝 Planned |

### Favorites and Pinning

| Tool Name                    | Description                         | Priority | Status     |
| ---------------------------- | ----------------------------------- | -------- | ---------- |
| `linear_getFavorites`        | Get a list of user's favorite items | Medium   | 📝 Planned |
| `linear_addToFavorites`      | Add an item to favorites            | Medium   | 📝 Planned |
| `linear_removeFromFavorites` | Remove an item from favorites       | Medium   | 📝 Planned |
| `linear_pinIssue`            | Pin an issue to the top of a list   | Medium   | 📝 Planned |
| `linear_unpinIssue`          | Unpin an issue                      | Medium   | 📝 Planned |

### User Preferences

| Tool Name                      | Description                      | Priority | Status     |
| ------------------------------ | -------------------------------- | -------- | ---------- |
| `linear_getUserPreferences`    | Get user preferences             | Low      | 📝 Planned |
| `linear_updateUserPreferences` | Update user preferences          | Low      | 📝 Planned |
| `linear_getUserSettings`       | Get user application settings    | Low      | 📝 Planned |
| `linear_updateUserSettings`    | Update user application settings | Low      | 📝 Planned |

### Metrics and Reporting

| Tool Name                           | Description                                 | Priority | Status     |
| ----------------------------------- | ------------------------------------------- | -------- | ---------- |
| `linear_getTeamCycles`              | Get information about team cycles           | Medium   | 📝 Planned |
| `linear_getCycleIssues`             | Get issues for a specific cycle             | Medium   | 📝 Planned |
| `linear_getTeamMetrics`             | Get performance metrics for a team          | Low      | 📝 Planned |
| `linear_getIssueAnalytics`          | Get analytics for issues (cycle time, etc.) | Medium   | 📝 Planned |
| `linear_generateReport`             | Generate a custom report                    | Low      | 📝 Planned |
| `linear_getVelocityMetrics`         | Get team velocity metrics                   | Medium   | 📝 Planned |
| `linear_getCompletionRateMetrics`   | Get completion rate metrics                 | Medium   | 📝 Planned |
| `linear_getTimeToResolutionMetrics` | Get time-to-resolution metrics              | Medium   | 📝 Planned |

### Audit and History

| Tool Name                           | Description                              | Priority | Status     |
| ----------------------------------- | ---------------------------------------- | -------- | ---------- |
| `linear_getOrganizationAuditEvents` | Get audit events for the organization    | Medium   | 📝 Planned |
| `linear_getUserAuditEvents`         | Get audit events for a specific user     | Medium   | 📝 Planned |
| `linear_getTeamAuditEvents`         | Get audit events for a specific team     | Medium   | 📝 Planned |
| `linear_getEntityHistory`           | Get the history of changes for an entity | Medium   | 📝 Planned |

### API and Authentication

| Tool Name                   | Description                   | Priority | Status     |
| --------------------------- | ----------------------------- | -------- | ---------- |
| `linear_createApiKey`       | Create a new API key          | Low      | 📝 Planned |
| `linear_revokeApiKey`       | Revoke an API key             | Low      | 📝 Planned |
| `linear_getApiKeys`         | Get all API keys for the user | Low      | 📝 Planned |
| `linear_revokeUserSessions` | Revoke all user sessions      | Low      | 📝 Planned |

## Implementation Guide

When implementing new tools, follow these steps:

1. Add a new tool definition in the appropriate file under `src/tools/definitions/`
2. Implement the handler function in `src/tools/handlers/`
3. Add any necessary type guards in `src/tools/type-guards.ts`
4. Add any required methods to the `LinearService` class in `src/services/linear-service.ts`
5. Register the tool in `src/tools/definitions/index.ts`
6. Register the handler in `src/tools/handlers/index.ts`
7. Update this document to mark the tool as implemented

## Status Legend

- ✅ Implemented: Tool is fully implemented and tested
- 🔄 In Progress: Tool is currently being implemented
- 📝 Planned: Tool is planned for future implementation
- ❓ Under Consideration: Tool is being considered, but not yet planned
