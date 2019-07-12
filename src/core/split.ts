export function split<T>(data: T[], count: number): T[][] {
  const ret: T[][] = [];

  let cursor = 0;

  while (cursor < data.length) {
    const sub: T[] = [];
    for (let i = 0; cursor < data.length && i < count; ++i) {
      sub.push(data[cursor]);
      cursor += 1;
    }
    ret.push(sub);
  }

  return ret;
}
