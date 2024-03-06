export const config = {
  exportType: 'default',
  nameFormat: 'none',
  implementation: 'sass',
  additionalData: `@use 'foundation/index.scss' as *;`,
  includePaths: ['src/styles'],
  ignore: ['**/foundation.scss', '**/foundation/**'],
};
