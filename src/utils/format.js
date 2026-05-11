export const formatDate = (dateStr) => {
  if (!dateStr) return "-"
  return dateStr.slice(0, 16).replace("T", " ")
}
