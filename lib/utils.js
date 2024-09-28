export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(input) {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path) {
  return `${process.env.NEXT_PUBLIC_APP_URL}${path}`
}

export function truncate(str, length) {
  return str.length > length ? `${str.substring(0, length)}...` : str
}

export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}