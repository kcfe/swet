import chalk from 'chalk'

class Logger {
  info(message: string) {
    console.log(chalk.blueBright(message))
  }

  warn(message: string) {
    console.log(chalk.yellowBright(message))
  }

  error(message: string) {
    console.log(chalk.redBright(message))
    process.exit(1)
  }

  success(message: string) {
    console.log(chalk.greenBright(message))
  }
}

export const logger = new Logger()
