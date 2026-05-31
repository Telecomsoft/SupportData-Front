export function persianToLatinNumber(input: string): string {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return !!input ? input?.toString()
        ?.split('')
        ?.map(ch => {
            const index = persianDigits.indexOf(ch);
            return index >= 0 ? index.toString() : ch;
        })
        ?.join('') : '0';
}