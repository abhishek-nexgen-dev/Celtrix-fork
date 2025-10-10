import inquirer from "inquirer";
import chalk from "chalk";
import gradient from "gradient-string";
import figlet from "figlet";
import { createProject } from "./commands/scaffold.js";
import mevnQuestions from "./setup/mevn/mevn.question.js";
import t3_Stack_Questions from "./setup/t3-stack/t3-stack.js";
import Mern_Questions from "./setup/Mern/Mern.question.js";

function showBanner() {
  console.log(
    gradient.pastel(
      figlet.textSync("Celtrix", {
        font: "Big",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(chalk.gray("⚡ Setup Web-apps in seconds, not hours ⚡\n"));
}

// Stack configurations
const stacks = {
  mern: {
    name: chalk.bold.blue("MERN") + " → MongoDB + Express + React + Node.js",
    value: "mern",
    questions: Mern_Questions
  },
  mean: {
    name: chalk.bold.red("MEAN") + " → MongoDB + Express + Angular + Node.js",
    value: "mean",
    questions: [
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
  },
  "typescript-backend": {
    name: chalk.bold.green("Backend With TypeScript") + " → Express + TypeScript + Socket.io + MongoDB + JWT Auth + Docker + More",
    value: "typescript-backend",
    questions: [
      {
        type: "confirm",
        name: "includeSocketIO",
        message: "Include Socket.IO for real-time features?",
        default: true,
      },
      {
        type: "confirm",
        name: "includeDockerConfig",
        message: "Include Docker configuration?",
        default: true,
      }
    
    ]
  },
  mevn: {
    name: chalk.bold.cyan("MEVN") + " → MongoDB + Express + Vue.js + Node.js",
    value: "mevn",
    questions: mevnQuestions 
  },
  "t3-stack": {
    name: chalk.bold.yellow("Next.js") + " + tRPC + Prisma + Tailwind + Auth",
    value: "t3-stack",
    questions: t3_Stack_Questions
  },
  hono: {
    name: chalk.bold.red("Hono") + " → Hono + Prisma + React",
    value: "hono",
    questions: [
      {
        type: "list",
        name: "deployTarget",
        message: "Choose deployment target:",
        choices: [
          { name: "Cloudflare Workers", value: "cloudflare" },
          { name: "Node.js", value: "nodejs" },
          { name: "Deno", value: "deno" },
        ],
        default: "nodejs",
      },
      {
        type: "confirm",
        name: "includeTailwind",
        message: "Include Tailwind CSS?",
        default: true,
      }
    ]
  }
};

async function askStackQuestions() {
  // First, ask for the main stack
  const { stack } = await inquirer.prompt([
    {
      type: "list",
      name: "stack",
      message: "Choose your stack:",
      choices: Object.values(stacks).map(stack => ({ name: stack.name, value: stack.value })),
      pageSize: 10,
      default: "mern",
    }
  ]);

  // Now ask stack-specific questions
  const selectedStack = Object.values(stacks).find(s => s.value === stack);
  
  console.log(chalk.cyan(`\n📚 Configuring your ${selectedStack.name.split("→")[0].trim()} project...\n`));
  
  let answers = { stack };
  if (selectedStack.questions && selectedStack.questions.length > 0) {
    const stackAnswers = await inquirer.prompt(selectedStack.questions);
    answers = { ...answers, ...stackAnswers };
  }

  return answers;
}

async function askProjectName() {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: chalk.cyan("📦 Enter your project name:"),
      validate: (input) => {
        if (!input.trim()) return chalk.red("Project name is required!");
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
          return chalk.red(
            "Only letters, numbers, hyphens, and underscores are allowed."
          );
        }
        return true;
      },
    },
  ]);
  return projectName;
}

async function main() {
  console.log("\n");
  showBanner();

  let projectName = process.argv[2];
  let config;

  try {
    if (!projectName) {
      projectName = await askProjectName();
    }
    
    const stackAnswers = await askStackQuestions();
    config = { ...stackAnswers, projectName };
    
    console.log(chalk.green("\n🔍 Configuration summary:"));
    console.log(JSON.stringify(config, null, 2));
    
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: chalk.yellow("\n🚀 Ready to create your project?"),
        default: true
      }
    ]);
    
    if (confirm) {
      console.log(chalk.yellow("\n🚀 Creating your project...\n"));
     await createProject(projectName, config);
    } else {
      console.log(chalk.red("\n❌ Project creation cancelled."));
      process.exit(0);
    }

  } catch (err) {
    console.log(chalk.red("❌ Error:"), err.message);
    process.exit(1);
  }
}

main();