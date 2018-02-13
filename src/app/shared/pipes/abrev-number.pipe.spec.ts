import { AbrevNumberPipe } from './abrev-number.pipe';

describe('AbrevNumberPipe', () => {
  let pipe: AbrevNumberPipe;

  beforeEach(() => {
    pipe = new AbrevNumberPipe();
  });

  it('transforms numbers to rounded and abbreviated strings', () => {
    expect(pipe.transform(999.2)).toEqual('999');
    expect(pipe.transform(1000)).toEqual('1K');
    expect(pipe.transform(1111)).toEqual('1.1K');
    expect(pipe.transform(12345)).toEqual('12.3K');
    expect(pipe.transform(123456)).toEqual('123K');
    expect(pipe.transform(123456789)).toEqual('123457K');
  });
});
