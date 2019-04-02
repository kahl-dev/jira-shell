import JiraClient from 'jira-connector'
require('datejs')

import config from './config'

const JIRA_HOST = config.getHost()
const USER_MAIL = config.getUserMail()
const USER_TOKEN = config.getUserToken()

const getJiraClient = () =>
  new JiraClient({
    host: JIRA_HOST,
    basic_auth: {
      username: USER_MAIL,
      password: USER_TOKEN,
    },
  })

export const getUserWorklogs = async (
  date = Date.today().toString('yyyy-MM-dd'),
  email = USER_MAIL
) => {
  const jira = getJiraClient()
  const filterUserName = email.split('@')[0]

  // Search for all issues from given user with worklogs for given date
  const { issues } = await jira.search.search({
    jql: `worklogAuthor = ${filterUserName} AND worklogDate >= ${date}`,
  })

  let worklogs = []
  for (const issue of issues) {
    // Get all single worklogs for each issue
    const { worklogs: data } = await jira.issue.getWorkLogs({
      issueId: issue.id,
    })

    const tmpWorklogs = data
      // Filter date and user
      .filter(worklog => {
        const isFilterDate = Date.compare(
          Date.parse(worklog.started),
          Date.parse(date)
        )
        return worklog.author.emailAddress === email && isFilterDate >= 0
      })
      // Shrink data
      .map(worklog => ({ issue, worklog }))

    worklogs = [...worklogs, ...tmpWorklogs]
  }

  // Sort worklogs
  worklogs = worklogs.sort((a, b) =>
    Date.compare(Date.parse(a.worklog.started), Date.parse(b.worklog.started))
  )

  return worklogs
}
