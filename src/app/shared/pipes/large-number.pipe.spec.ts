import { LargeNumberPipe } from './large-number.pipe';

describe('LargeNumberPipe', () => {
  let pipe: LargeNumberPipe;

  beforeEach(() => {
    pipe = new LargeNumberPipe();
  });

  it('transforms numbers to locale strings that have thousands separators', () => {
    const value = 1000;
    expect(pipe.transform(value)).toEqual('1,000');
  });

  it('returns zero only for zero values', () => {
    expect(pipe.transform(undefined)).toEqual(undefined);
    expect(pipe.transform(null)).toEqual(undefined);
    expect(pipe.transform(0)).toEqual('0');
  });
});
