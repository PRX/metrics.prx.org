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

  it('returns zero for falsey values', () => {
    expect(pipe.transform(undefined)).toEqual('0');
    expect(pipe.transform(null)).toEqual('0');
    expect(pipe.transform(Number(false))).toEqual('0');
  });
});
