/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert';
import { canConfirmDeckRemoval } from './deckRemoval.ts';

test('canConfirmDeckRemoval - archive_cards scope', () => {
  // Should allow if checkbox is checked
  assert.strictEqual(canConfirmDeckRemoval('archive_cards', 'Oxford 3000 Essential Vocabulary', true, ''), true);
  // Should reject if checkbox is unchecked
  assert.strictEqual(canConfirmDeckRemoval('archive_cards', 'Oxford 3000 Essential Vocabulary', false, ''), false);
});

test('canConfirmDeckRemoval - purge_all scope', () => {
  const title = 'Oxford 3000 Essential Vocabulary';

  // Exact match
  assert.strictEqual(canConfirmDeckRemoval('purge_all', title, false, 'Oxford 3000 Essential Vocabulary'), true);
  // Case-insensitive & trimmed match
  assert.strictEqual(canConfirmDeckRemoval('purge_all', title, false, ' oxford 3000 essential vocabulary '), true);

  // Incorrect title typed
  assert.strictEqual(canConfirmDeckRemoval('purge_all', title, false, 'Oxford'), false);
  assert.strictEqual(canConfirmDeckRemoval('purge_all', title, false, ''), false);
  assert.strictEqual(canConfirmDeckRemoval('purge_all', title, false, 'Other Title'), false);
});
