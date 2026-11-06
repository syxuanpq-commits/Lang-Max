/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RemovalScope = 'unbind' | 'permanent';

/**
 * Validates whether Layer 2 security criteria are met to allow flashcard removal.
 * 
 * @param scope 'unbind' (remove from deck to unassigned) or 'permanent' (complete deletion)
 * @param targetWord The exact flashcard word
 * @param isConfirmedCheckbox Whether user checked the confirmation checkbox (for unbind)
 * @param confirmationInput The text user typed to confirm permanent deletion
 */
export function canConfirmRemoval(
  scope: RemovalScope,
  targetWord: string,
  isConfirmedCheckbox: boolean,
  confirmationInput: string
): boolean {
  if (scope === 'unbind') {
    return isConfirmedCheckbox === true;
  }
  
  if (scope === 'permanent') {
    if (!targetWord || !confirmationInput) return false;
    return confirmationInput.trim().toLowerCase() === targetWord.trim().toLowerCase();
  }

  return false;
}
