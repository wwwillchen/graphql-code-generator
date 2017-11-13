import { executeWithOptions } from '../src/cli';

describe('executeWithOptions', () => {
  it('execute the correct results when using file', async () => {
    const result = await executeWithOptions({
      file: '../../dev-test/githunt/schema.json',
      template: 'typescript',
    });

    expect(result.length).toBe(1);
  });
});
