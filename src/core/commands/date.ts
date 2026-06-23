
import dayjs from "dayjs"
export const getCurrentTime = (): string => {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
  return now
}