import program from 'commander'
import co from 'co'
import prompt from 'co-prompt'
import chalk from 'chalk'
require('datejs')

import { convertSecondsToHrsMins, startOfWeek, logWorklog } from './utils'
import config from './config'
import { getUserWorklogs } from './jira'

// Create program
program
  .option('-c, --config', 'Set inital configuration')
  .option('-w, --worklog', 'Get Worklog')
  .parse(process.argv)

// Check if config file exists or exit
config.initConfig(program)

// Create config
if (program.config) config.createConfig()

// Log worklog
if (program.worklog) {
  getUserWorklogs(
    program.args[0]
      ? Date.parse(program.args[0]).toString('yyyy-MM-dd')
      : undefined
  ).then(data => {
    let date
    let table = []
    let seconds = 0
    data.forEach(item => {
      const itemDate = Date.parse(item.worklog.started).toString('yyyy-MM-dd')
      if (itemDate !== date) {
        date = itemDate
        if (table.length) {
          table.push({
            'Time Spent: ': `${convertSecondsToHrsMins(seconds)}`,
          })
          console.table(table)
        }
        console.log('')
        console.log(chalk.inverse(date))

        table = []
        seconds = 0
      }

      seconds += item.worklog.timeSpentSeconds
      table.push({
        'Issue: ': item.issue.key,
        'Comment: ': item.worklog.comment,
        'Time Spent: ': `${convertSecondsToHrsMins(
          item.worklog.timeSpentSeconds
        )}`,
      })
    })
    table.push({
      'Time Spent: ': `${convertSecondsToHrsMins(seconds)}`,
    })
    console.table(table)
  })
}
