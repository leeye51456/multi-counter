module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/*.js", "**/*.jsx"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "comment-empty-line-before": null,
    "declaration-block-trailing-semicolon": null,
    "declaration-empty-line-before": null,
    "no-descending-specificity": null,
    "at-rule-empty-line-before": null,
    "max-empty-lines": 2,
    "rule-empty-line-before": null,
  },
};
