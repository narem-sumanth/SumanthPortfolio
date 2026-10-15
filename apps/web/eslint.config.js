const base = require("@portfolio/eslint-config");

module.exports = [
  ...base,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Each feature's public surface is its index.ts barrel — reaching into
      // components/ or lib/ from outside the feature bypasses that boundary.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/components",
                "@/features/*/components/**",
                "@/features/*/lib",
                "@/features/*/lib/**",
              ],
              message: "Import from the feature's barrel (e.g. \"@/features/chat\") instead of reaching into its components/ or lib/ internals.",
            },
          ],
        },
      ],
    },
  },
];
