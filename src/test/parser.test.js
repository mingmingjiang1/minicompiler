import { DFAedge } from '../../parser';

test('adds 1 + 2 to equal 3', () => {
  expect(DFAedge(getClosure([0], atoi('i')))).toBe(3);
});