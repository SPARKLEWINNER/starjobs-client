import {format, formatDistanceToNow} from 'date-fns'

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy')
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm')
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p')
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}

export function tConvert(time) {
  if (!time) return ''
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]
  if (time.length > 1) {
    time = time.slice(1)
    time[5] = +time[0] < 12 ? 'AM' : 'PM'
    time[0] = +time[0] % 12 || 12
  }
  return time.join('')
}

export function tConvert12Hour(date) {
  date = date.replace('PM', '').replace('AM', '')
  var hours = date.split(':')[0]
  var minutes = date.split(':')[1]
  var ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}
