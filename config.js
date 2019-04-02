// Read/Write config file
import nconf from 'nconf'

// Handle user prompts
import co from 'co'
import prompt from 'co-prompt'

// OS functions
import os from 'os'

// Shell functions
import sh from 'shelljs'

const CONFIG_FILE = `${os.homedir()}/.jira.config.json`

const initConfig = program => {
  const isConfig = sh.test('-e', CONFIG_FILE)
  if (!isConfig && !program.config) {
    sh.echo('We could not find your configuration. Please run `jira -c`')
    process.exit(0)
  }
}

const createConfig = () => {
  co(function*() {
    nconf.file({ file: CONFIG_FILE })

    const JIRA_HOST = yield prompt('Please enter your jira host: ')
    nconf.set('jira:host', JIRA_HOST)

    const USER_MAIL = yield prompt('Please insert your user mail: ')
    nconf.set('user:mail', USER_MAIL)

    const USER_TOKEN = yield prompt('Please inser your access token: ')
    nconf.set('user:token', USER_TOKEN)

    nconf.save()
    sh.echo('OK. Now we are good to go. Try `jira -h` for some help.')
    process.exit(0)
  })
}

const getHost = () => {
  nconf.file({ file: CONFIG_FILE })
  return nconf.get('jira:host')
}

const getUserMail = () => {
  nconf.file({ file: CONFIG_FILE })
  return nconf.get('user:mail')
}

const getUserToken = () => {
  nconf.file({ file: CONFIG_FILE })
  return nconf.get('user:token')
}

export default {
  initConfig,
  createConfig,
  getHost,
  getUserMail,
  getUserToken,
}
