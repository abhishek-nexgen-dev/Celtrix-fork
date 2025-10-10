import chalk from "chalk";

let mevnQuestions = [
    {
      type: "list",
      name: "frontendLanguage",
      message: "Choose frontend language:",
      choices: [
        { name: chalk.bold.yellow("Vue with JavaScript"), value: "javascript" },
        { name: chalk.bold.blue("Vue with TypeScript"), value: "typescript" },
      ],
      default: "typescript",
    },
    {
      type: "list",
      name: "backendLanguage",
      message: "Choose backend language:",
      choices: [
        { name: chalk.bold.yellow("Node.js with JavaScript"), value: "javascript" },
        { name: chalk.bold.blue("Node.js with TypeScript"), value: "typescript" },
      ],
      default: "typescript",
    },
    {
      type: "confirm",
      name: "includeTailwind",
      message: "Include Tailwind CSS?",
      default: false,
    },
    {
      type: "confirm",
      name: "includeAuth",
      message: "Include authentication?",
      default: true,
    }
  ]

export default mevnQuestions;