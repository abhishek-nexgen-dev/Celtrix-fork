let t3_Stack_Questions = [
    {
      type: "list",
      name: "databaseChoice",
      message: "Choose your database:",
      choices: [
        { name: "PostgreSQL", value: "postgres" },
        { name: "MySQL", value: "mysql" },
        { name: "SQLite", value: "sqlite" },
      ],
      default: "postgres",
    },
    {
      type: "confirm",
      name: "includeTestingLib",
      message: "Include testing libraries?",
      default: true,
    }
  ]
  
  export default t3_Stack_Questions;