require('datejs')

export const convertSecondsToHrsMins = seconds => {
  const mins = seconds / 60
  let h = Math.floor(mins / 60)
  let m = mins % 60
  h = h < 10 ? '0' + h : h
  m = m < 10 ? '0' + m : m
  return `${h}:${m}`
}

export const startOfWeek = Date.today()
  .previous()
  .monday()
  .toString('yyyy-MM-dd')

export const logWorklog = data => {
  console.log(`-----
Ticket: ${data.issue}
Kommentar: ${data.comment}
Dauer: ${data.timeSpent}
Datum: ${Date.parse(data.started).toString('yyyy-MM-dd')}`)
}
