import stripAnsi from 'strip-ansi'
import { chalk } from 'zx'

function format(label: string, msg: string): string {
  return msg
    .split('\n')
    .map((line, i) => {
      return i === 0
        ? `${label} ${line}`
        : line.padStart(stripAnsi(label).length + line.length + 1)
    })
    .join('\n')
}

function chalkTag(msg: string): string {
  return chalk.bgBlackBright.white.dim(` ${msg} `)
}

function log(msg = '', tag = ''): void {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
}

function info(msg: string): void {
  console.log(format(chalk.bgBlue.black(' INFO '), msg))
}

function done(msg: string): void {
  console.log(format(chalk.bgGreen.black(' DONE '), msg))
}

function warn(msg: string): void {
  console.warn(format(chalk.bgYellow.black(' WARN '), chalk.yellow(msg)))
}

function error(msg: string): void {
  console.error(format(chalk.bgRed(' ERROR '), chalk.red(msg)))
}

function printErrorAndExit(msg: string): void {
  error(msg)
  process.exit(1)
}

function step(name: string): (msg: string) => void
function step(name: string, msg: string): void
function step(name: string, msg?: string): void | ((msg: string) => void) {
  if (msg) {
    console.log(`\n${chalk.gray(`>>> ${name}:`)} ${chalk.magenta.bold(msg)}`)
  } else {
    return (ms: string): void =>
      console.log(`\n${chalk.gray(`>>> ${name}:`)} ${chalk.magenta.bold(ms)}`)
  }
}

export const logger = {
  log,
  info,
  done,
  warn,
  error,
  printErrorAndExit,
  step,
}
