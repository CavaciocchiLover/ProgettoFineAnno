import 'server-only'

const dictionaries = {
    it: () => import('../messages/it.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'it') =>
    dictionaries[locale]()