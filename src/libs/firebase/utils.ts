import { format } from 'date-fns'
import { ja } from 'date-fns/locale/ja'

export const convertTimestampToStr = (timestamp: number | null): string => {
  if (timestamp) {
    return format(new Date(timestamp * 1000), 'yyyy年MM月dd日(eee)', {
      locale: ja,
    })
  } else {
    return ''
  }
}
