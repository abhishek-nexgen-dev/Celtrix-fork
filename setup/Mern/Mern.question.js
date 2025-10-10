import chalk from "chalk";



let Mern_Questions = [
      {
        type: "list",
        name: "frontendLanguage",
        message: "Choose frontend language:",
        choices: [
          { name: chalk.bold.yellow("React with JavaScript"), value: "javascript" },
          { name: chalk.bold.blue("React with TypeScript"), value: "typescript" },
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
        name: "setupESLint",
        message: "Setup ESLint configuration?",
        default: true,
    
      },
      {
        type: "confirm",
        name: "setupPrettier",
        message: "Setup Prettier configuration?",
        default: true,
    
      },
      {
        type: "confirm",
        name: "setUpGitAndHusky",
        message: "Set up Git and Husky?",
        default: true,
      },
      {
        type: "confirm",
        name: "includeAuth",
        message: "Include authentication?",
        default: true,
    }
]

export default Mern_Questions;