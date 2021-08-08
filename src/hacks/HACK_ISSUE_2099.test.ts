import { Reference } from '@mikro-orm/core';
import { User } from '../entities';
import { createReferenceForDirectFkAssignment, isHacked } from './HACK_ISSUE_2099';

describe('HACK_ISSUE_2099', () => {
  it('marks the reference as uninitialized', () => {
    const ref = createReferenceForDirectFkAssignment(new User());
    expect(ref.isInitialized()).toBeFalse();
  });

  it('marks the reference as hacked', () => {
    const ref = createReferenceForDirectFkAssignment(new User());
    expect(isHacked(ref)).toBeTrue();
  });

  it('does not consider regular references as hacked', () => {
    const ref = Reference.create(new User());
    expect(isHacked(ref)).toBeFalse();
  });
});
