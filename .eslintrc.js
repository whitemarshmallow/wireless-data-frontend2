module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  rules: {
    // 关闭多单词组件名规则
    "vue/multi-word-component-names": "off",

    // 关闭其他可能烦人的规则
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "warn",

    // Prettier 相关
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },

  // 针对特定文件的规则覆盖
  overrides: [
    {
      files: ["src/views/*.vue", "src/App.vue"],
      rules: {
        "vue/multi-word-component-names": "off",
      },
    },
    {
      files: ["EnergySaving*.vue", "src/demo/EnergySaving/*.js", "src/components/charts/*.vue"],
      rules: {
        "prettier/prettier": "off",
      },
    },
  ],
};
