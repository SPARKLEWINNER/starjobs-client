export function fCamelCase(text) {
  const result = text.replace(/([A-Z])/g, ' $1')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function nameInitials(text) {
  if (text.split(' ').length === 1) {
    return `${text.split('')[0]}.`
  } else {
    return `${text.split(' ')[0][0]}${text.split(' ')[1][0]}`
  }
}
