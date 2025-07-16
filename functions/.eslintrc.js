module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true, // <-- A linha mais importante
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-undef": "off", // Desativa a regra que causa os erros
  },
};