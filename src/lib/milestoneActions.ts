/**
 * Milestone & Escrow Workflow State Machine
 * Author: Principal Systems Architect
 * Description: Deterministic state transition engine enforcing strict invariant checks,
 *              milestone delivery proof validation, and atomic escrow balance transfers.
 */

import { Milestone, MilestoneStatus, WalletTransaction } from '@/types';

export interface StateTransitionResult {
  success: boolean;
  message: string;
  milestone?: Milestone;
  transaction?: WalletTransaction;
}

// Valid state transition graph
const ALLOWED_TRANSITIONS: Record<MilestoneStatus, MilestoneStatus[]> = {
  pending_approval: ['in_progress'],
  in_progress: ['submitted_for_review'],
  submitted_for_review: ['completed', 'in_progress'], // completed (approve) or in_progress (request revision)
  completed: [], // Terminal state
};

/**
 * Validates whether a state transition is legal in the escrow state machine
 */
export function isValidTransition(current: MilestoneStatus, next: MilestoneStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[current] || [];
  return allowed.includes(next);
}

/**
 * Client deposits / approves milestone start (locks escrow)
 */
export function fundMilestone(
  milestone: Milestone,
  clientBalance: number
): StateTransitionResult {
  if (!isValidTransition(milestone.status, 'in_progress')) {
    return {
      success: false,
      message: `Illegal transition from ${milestone.status} to in_progress`,
    };
  }

  if (clientBalance < milestone.amount) {
    return {
      success: false,
      message: `Insufficient client wallet funds (₹${clientBalance}) for milestone amount ₹${milestone.amount}`,
    };
  }

  const updatedMilestone: Milestone = {
    ...milestone,
    status: 'in_progress',
    updated_at: new Date().toISOString(),
  };

  const transaction: WalletTransaction = {
    id: `tx_${Date.now()}_hold`,
    user_id: 'client_active',
    amount: milestone.amount,
    type: 'escrow_hold',
    description: `Escrow Hold: Milestone "${milestone.title}" funded`,
    created_at: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Milestone funded. ₹${milestone.amount} locked securely in platform escrow.`,
    milestone: updatedMilestone,
    transaction,
  };
}

/**
 * Freelancer delivers milestone proof & attaches links/artifacts
 */
export function submitDeliverable(
  milestone: Milestone,
  deliverableUrl: string,
  submissionNotes: string
): StateTransitionResult {
  if (!isValidTransition(milestone.status, 'submitted_for_review')) {
    return {
      success: false,
      message: `Illegal transition from ${milestone.status} to submitted_for_review`,
    };
  }

  if (!deliverableUrl && !submissionNotes) {
    return {
      success: false,
      message: 'Deliverable proof link or detailed submission notes are required.',
    };
  }

  const updatedMilestone: Milestone = {
    ...milestone,
    status: 'submitted_for_review',
    deliverable_url: deliverableUrl,
    submission_notes: submissionNotes,
    revision_feedback: undefined,
    updated_at: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Deliverable submitted to client for verification.',
    milestone: updatedMilestone,
  };
}

/**
 * Client approves milestone & atomically releases escrow funds to freelancer
 */
export function approveMilestone(
  milestone: Milestone,
  freelancerId: string
): StateTransitionResult {
  if (!isValidTransition(milestone.status, 'completed')) {
    return {
      success: false,
      message: `Illegal transition from ${milestone.status} to completed`,
    };
  }

  const updatedMilestone: Milestone = {
    ...milestone,
    status: 'completed',
    updated_at: new Date().toISOString(),
  };

  const transaction: WalletTransaction = {
    id: `tx_${Date.now()}_release`,
    user_id: freelancerId,
    amount: milestone.amount,
    type: 'escrow_release',
    description: `Milestone Escrow Released: "${milestone.title}" approved by client`,
    created_at: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Milestone approved! ₹${milestone.amount} released to freelancer wallet.`,
    milestone: updatedMilestone,
    transaction,
  };
}

/**
 * Client requests revision with mandatory constructive feedback
 */
export function requestRevision(
  milestone: Milestone,
  feedbackNotes: string
): StateTransitionResult {
  if (!isValidTransition(milestone.status, 'in_progress')) {
    return {
      success: false,
      message: `Illegal transition from ${milestone.status} to in_progress`,
    };
  }

  if (!feedbackNotes || feedbackNotes.trim().length < 10) {
    return {
      success: false,
      message: 'Constructive revision feedback (minimum 10 characters) is required.',
    };
  }

  const updatedMilestone: Milestone = {
    ...milestone,
    status: 'in_progress',
    revision_feedback: feedbackNotes,
    updated_at: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Revision requested. Milestone status reverted to in_progress for freelancer rework.',
    milestone: updatedMilestone,
  };
}
