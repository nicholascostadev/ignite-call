export const getWeekDays = () => {
  const { format } = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => weekDay.charAt(0).toUpperCase() + weekDay.slice(1))
}
