module.exports = {
  endOfLine: "crlf",
  jsxSingleQuote: true,
  quoteProps: "as-needed",
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  overrides: [
    {
      files: "*.md",
      options: {
        tabWidth: 4,
      },
    },
  ],
};
