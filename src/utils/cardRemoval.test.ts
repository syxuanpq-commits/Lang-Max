/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert';
import { canConfirmRemoval } from './cardRemoval.ts';

test('canConfirmRemoval - unbind scope', () => {
  // Should allow if checkbox is checked
  assert.strictEqual(canConfirmRemoval('unbind', 'Eloquent', true, ''), true);
  // Should reject if checkbox is unchecked
  assert.strictEqual(canConfirmRemoval('unbind', 'Eloquent', false, ''), false);
});

test('canConfirmRemoval - permanent scope', () => {
  const word = 'Ambiguous';

  // Exact match
  assert.strictEqual(canConfirmRemoval('permanent', word, false, 'Ambiguous'), true);
  // Case-insensitive & trimmed match
  assert.strictEqual(canConfirmRemoval('permanent', word, false, ' ambiguous '), true);

  // Incorrect word typed
  assert.strictEqual(canConfirmRemoval('permanent', word, false, 'ambig'), false);
  assert.strictEqual(canConfirmRemoval('permanent', word, false, ''), false);
  assert.strictEqual(canConfirmRemoval('permanent', word, false, 'otherword'), false);
});
