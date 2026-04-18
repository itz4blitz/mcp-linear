import {
  isAddIssueToCycleArgs,
  isGetActiveCycleArgs,
  isGetCycleIssuesArgs,
  isGetCyclesArgs,
  isRemoveIssueFromCycleArgs,
} from '../type-guards.js';
import { LinearService } from '../../services/linear-service.js';
import { logError } from '../../utils/config.js';

/**
 * Handler for getting all cycles
 */
export function handleGetCycles(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCyclesArgs(args)) {
        throw new Error('Invalid arguments for getCycles');
      }

      return await linearService.getCycles(args.teamId, args.limit);
    } catch (error) {
      logError('Error getting cycles', error);
      throw error;
    }
  };
}

/**
 * Handler for getting the active cycle for a team
 */
export function handleGetActiveCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetActiveCycleArgs(args)) {
        throw new Error('Invalid arguments for getActiveCycle');
      }

      return await linearService.getActiveCycle(args.teamId);
    } catch (error) {
      logError('Error getting active cycle', error);
      throw error;
    }
  };
}

export function handleGetCycleIssues(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isGetCycleIssuesArgs(args)) {
        throw new Error('Invalid arguments for getCycleIssues');
      }

      return await linearService.getCycleIssues(args);
    } catch (error) {
      logError('Error getting cycle issues', error);
      throw error;
    }
  };
}

/**
 * Handler for adding an issue to a cycle
 */
export function handleAddIssueToCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isAddIssueToCycleArgs(args)) {
        throw new Error('Invalid arguments for addIssueToCycle');
      }

      return await linearService.addIssueToCycle(args.issueId, args.cycleId);
    } catch (error) {
      logError('Error adding issue to cycle', error);
      throw error;
    }
  };
}

/**
 * Handler for removing an issue from a cycle
 */
export function handleRemoveIssueFromCycle(linearService: LinearService) {
  return async (args: unknown) => {
    try {
      if (!isRemoveIssueFromCycleArgs(args)) {
        throw new Error('Invalid arguments for removeIssueFromCycle');
      }

      return await linearService.removeIssueFromCycle(args.issueId, args.cycleId);
    } catch (error) {
      logError('Error removing issue from cycle', error);
      throw error;
    }
  };
}
