type GetWeekDaysParams = {
  short?: boolean
}

export const getWeekDays = ({ short = false }: GetWeekDaysParams = {}) => {
  const { format } = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => format(new Date(Date.UTC(2021, 5, day))))
    .map((weekDay) => {
      if (short) {
        return weekDay.substring(0, 3).toUpperCase()
      }

      return weekDay.charAt(0).toUpperCase() + weekDay.slice(1)
    })
}
