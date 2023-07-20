require("@rushstack/eslint-patch/modern-module-resolution");
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
    "plugin:jest-dom/recommended",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
