export const title = (a: any) => typeof a === 'string'
    ? a.substring(0, 1).toLocaleUpperCase() + a.substring(1).toLocaleLowerCase()
    : null

export const titleSlug = (a: any) => typeof a === 'string'
    ? a.split('-').map(title).join(' ')
    : null

