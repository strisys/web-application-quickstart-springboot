

export class StringUtil {
   static capitalizeFirstLetter(str: string): string {
      if ((str || '').trim().length === 0) {
         return ''
      }

      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
   }
}