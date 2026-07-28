import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
      '**/*.config.{js,cjs,mjs,ts,mts,cts}',
    ],
  },
  ...nextCoreWebVitals,
];

export default eslintConfig;
