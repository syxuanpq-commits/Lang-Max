/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DeckRemovalScope = 'archive_cards' | 'purge_all';

/**
 * Validates whether Layer 2 security criteria are met to allow deck removal.
 * 
 * @param scope 'archive_cards' (keep cards in unassigned pool) or 'purge_all' (delete deck and all cards)
 * @param targetTitle The exact deck title
 * @param isConfirmedCheckbox Whether user checked the confirmation checkbox (for archive_cards)
 * @param confirmationInput The text user typed to confirm permanent deletion
 */
export function canConfirmDeckRemoval(
  scope: DeckRemovalScope,
  targetTitle: string,
  isConfirmedCheckbox: boolean,
  confirmationInput: string
): boolean {
  if (scope === 'archive_cards') {
    return isConfirmedCheckbox === true;
  }

  if (scope === 'purge_all') {
    if (!targetTitle || !confirmationInput) return false;
    return confirmationInput.trim().toLowerCase() === targetTitle.trim().toLowerCase();
  }

  return false;
}
