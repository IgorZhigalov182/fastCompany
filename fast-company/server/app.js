const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const initDatabase = require('./startUp/initDatabase');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);

const PORT = config.get('port') ?? 8080;

// if (process.env.NODE_ENV === 'production') {
//   console.log('production');
// } else {
//   console.log('dev');
// }

async function start() {
  try {
    mongoose.connection.once('open', () => {
      initDatabase();
    });
    await mongoose.connect(config.get('mongoUri'));
    console.log(chalk.green(`MongoDB connected`));
    app.listen(PORT, () => {
      console.log(chalk.green(`Server has been started on port ${PORT}`));
    });
  } catch (error) {
    console.log(chalk.red(error.message));
    process.exit(1); // выходим из процесса (код 1)
  }
}

start();
