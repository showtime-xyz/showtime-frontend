module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true,
  },
  extends: [
    "next",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:diff/diff",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    route: "readonly",
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "react/no-unescaped-entities": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks:
          "(useMotiPressableTransition|useMotiPressable|useMotiPressables|useMotiPressableAnimatedProps|useInterpolateMotiPressable)",
      },
    ],
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
  reportUnusedDisableDirectives: true,
};
