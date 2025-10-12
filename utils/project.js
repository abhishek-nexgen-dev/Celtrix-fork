import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";
import { logger } from "./logger.js";
import { copyTemplates } from "./templateManager.js";
import { 
  HonoReactSetup, 
  mernTailwindSetup, 
  installDependencies, 
  mernSetup, 
  serverAuthSetup, 
  serverSetup, 
  mevnSetup,
  angularSetup, 
  angularTailwindSetup,
} from "./installer.js";
import SetupBackendWithTypeScript from "../setup/Mern/TypeScriptBackendSetup.js";

/**
 * Sets up a new project with the given configuration
 * @param {string} projectName - Name of the project
 * @param {Object} config - Project configuration
 * @returns {Promise<void>}
 */
export async function setupProject(projectName, config) {
  const spinner = ora('Setting up project...').start();
  const projectPath = path.join(process.cwd(), projectName);

  try {
  
    if (fs.existsSync(projectPath)) {
      spinner.fail(`Directory ${chalk.red(projectName)} already exists`);
      process.exit(1);
    }

   
    fs.mkdirSync(projectPath);
    spinner.succeed('Project directory created');
    spinner.text = 'Analyzing configuration...';

   
    displayProjectConfig(projectName, config);

   
    spinner.text = `Setting up ${config.stack} stack...`;
    await setupStackProject(projectPath, config, projectName);
    
    spinner.succeed(`${config.stack.toUpperCase()} stack setup completed`);

   
    displaySuccessMessage(projectName, config);
  } catch (error) {
    spinner.fail(`Project setup failed: ${error.message}`);
    logger.error(`Stack trace: ${error.stack}`);
    
    
    if (fs.existsSync(projectPath)) {
      try {
        fs.removeSync(projectPath);
        logger.info(`Cleaned up partial project directory: ${projectName}`);
      } catch (cleanupError) {
        logger.error(`Failed to clean up directory: ${cleanupError.message}`);
      }
    }
    
    process.exit(1);
  }
}

/**
 * Displays project configuration in a formatted box
 * @param {string} projectName - Name of the project
 * @param {Object} config - Project configuration
 */
function displayProjectConfig(projectName, config) {
  // Extract configuration properties for display
  const configItems = [
    [`🌐 Stack:`, chalk.green(config.stack)],
    [`📦 Project Name:`, chalk.blue(projectName)]
  ];

  // Add language configuration if available
  if (config.frontendLanguage) {
    configItems.push([`🖥️ Frontend:`, chalk.yellow(`React with ${config.frontendLanguage}`)]);
  }
  
  if (config.backendLanguage) {
    configItems.push([`⚙️ Backend:`, chalk.yellow(`Node.js with ${config.backendLanguage}`)]);
  }

  // Add other config options
  if (config.includeTailwind !== undefined) {
    configItems.push([`🎨 Tailwind CSS:`, config.includeTailwind ? chalk.green('Yes') : chalk.red('No')]);
  }
  
  if (config.includeAuth !== undefined) {
    configItems.push([`🔒 Authentication:`, config.includeAuth ? chalk.green('Yes') : chalk.red('No')]);
  }

  if (config.includeSocketIO !== undefined) {
    configItems.push([`🔌 Socket.IO:`, config.includeSocketIO ? chalk.green('Yes') : chalk.red('No')]);
  }

  if (config.includeDockerConfig !== undefined) {
    configItems.push([`🐳 Docker:`, config.includeDockerConfig ? chalk.green('Yes') : chalk.red('No')]);
  }

  if (config.databaseChoice) {
    configItems.push([`🗄️ Database:`, chalk.cyan(config.databaseChoice)]);
  }

  // Format the config text
  const configText = configItems
    .map(([label, value]) => `${chalk.bold(label)}  ${value}`)
    .join('\n    ');

  console.log(
    boxen(`\n    ${configText}\n`, {
      padding: 1,
      margin: 1,
      borderColor: "cyan",
      borderStyle: "round",
      title: chalk.cyanBright("📋 Project Configuration"),
      titleAlignment: "center",
    })
  );
}

/**
 * Sets up the project based on the selected stack
 * @param {string} projectPath - Path to the project directory
 * @param {Object} config - Project configuration
 * @param {string} projectName - Name of the project
 */
async function setupStackProject(projectPath, config, projectName) {
  const { stack } = config;
  
  // Define setup strategies for different stacks
  const setupStrategies = {
    mern: async () => {
      if(config.backendLanguage === 'typescript'){
        let ts = new SetupBackendWithTypeScript(projectPath, config, projectName)
        await ts.ConfigureTS();
      }
    },

    mean: async () => {
      if (config.includeTailwind && config.includeAuth) {
        await angularTailwindSetup(projectPath, config, projectName);
      } else {
        await angularSetup(projectPath, config);
      }
      await copyTemplates(projectPath, config);
      await installDependencies(projectPath, config, projectName);
      await serverSetup(projectPath, config, projectName);
    },

    mevn: async () => {
      await mevnSetup(projectPath, config, projectName);
      await copyTemplates(projectPath, config);
      await installDependencies(projectPath, config, projectName);
      await serverSetup(projectPath, config, projectName);
    },

    hono: async () => {
      try {
        await HonoReactSetup(projectPath, config, projectName);
        await installDependencies(projectPath, config, projectName, false);
      } catch (error) {
        logger.warn(`Hono React setup failed, falling back to template: ${error.message}`);
        await copyTemplates(projectPath, config);
      }
    },

    "typescript-backend": async () => {
      await typescriptBackendSetup(projectPath, config, projectName);
      await copyTemplates(projectPath, config);
      await installDependencies(projectPath, config, projectName);
    },

    "t3-stack": async () => {
      await copyTemplates(projectPath, config);
      await installDependencies(projectPath, config, projectName);
    }
  };

  // Get the setup strategy for the selected stack
  const setupStrategy = setupStrategies[stack];
  
  if (!setupStrategy) {
    throw new Error(`Unsupported stack: ${stack}`);
  }

  // Execute the setup strategy
  await setupStrategy();
}


function displaySuccessMessage(projectName, config) {
  // Success header
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(`${chalk.greenBright(`✅ Project ${chalk.bold.yellow(projectName)} created successfully! 🎉`)}`);
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  

  console.log(chalk.cyan("👉 Next Steps:\n"));
  
  // Different instructions based on stack
  const stackInstructions = {
    mean: [
      `${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm start")}`,
      `${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`
    ],
    "t3-stack": [
      `${chalk.yellow("cd")} ${projectName} && ${chalk.green("npm run dev")}`
    ],
    hono: [
      `${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`,
      `${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm run dev")}`
    ],
    "typescript-backend": [
      `${chalk.yellow("cd")} ${projectName} && ${chalk.green("npm run dev")}`
    ],
    default: [
      `${chalk.yellow("cd")} ${projectName}/client && ${chalk.green("npm run dev")}`,
      `${chalk.yellow("cd")} ${projectName}/server && ${chalk.green("npm start")}`
    ]
  };


  const instructions = stackInstructions[config.stack] || stackInstructions.default;
  

  instructions.forEach(instruction => {
    console.log(`   ${instruction}`);
  });
  
  // Footer
  console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  console.log(chalk.gray("\n✨ Made with ❤️  by Celtrix ✨\n"));
}