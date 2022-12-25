export const convertTimeStringToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const timeInMinutes = hours * 60 + minutes

  return timeInMinutes
}
