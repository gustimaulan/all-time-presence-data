export const parseDate = (dateString) => {
  const parts = dateString.split("/")
  if (parts.length === 3) {
    return new Date(parts[2], parts[1] - 1, parts[0])
  }
  return new Date(0)
}
