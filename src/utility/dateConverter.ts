import jalaali from 'jalaali-js'

/**
 * Converts a Gregorian date to a Shamsi (Jalali) date.
 * @param date A Gregorian date string (ISO format)
 * @returns A formatted Shamsi date string
 */
export const convertToShamsi = (date: string): string => {
   const [year, month, day] = date.split('T')[0].split('-').map(Number)
   const { jy, jm, jd } = jalaali.toJalaali(year, month, day)
   return `${jy}/${jm}/${jd}`
}

export const convertToGregorian = (shamsiDate: string): string => {
   console.log(shamsiDate)
   const [jy, jm, jd] = shamsiDate.split('-').map(Number)
   const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd) // Convert using jalaali-js
   return `${gy}-${String(gm).padStart(2, '0')}-${String(gd).padStart(2, '0')}` // Pad month/day with zeros
}

export const formatDateString = (date: string): string => {
   // Map of Persian to English digits
   const persianToEnglishMap: { [key: string]: string } = {
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9',
   }

   // Replace Persian digits with English digits
   const englishDate = date?.replace(/[۰-۹]/g, (char) => persianToEnglishMap[char])

   // Replace slashes with dashes
   return englishDate?.replace(/\//g, '-')
}
