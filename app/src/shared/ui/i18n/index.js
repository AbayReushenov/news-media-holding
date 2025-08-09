import ru from './ru.json'

// KISS: минималистичный словарь и t(), без внешних зависимостей
const dictionaries = { ru }
const DEFAULT_LOCALE = 'ru'

export function t(key, params) {
  const parts = key.split('.')
  let node = dictionaries[DEFAULT_LOCALE]
  for (const p of parts) {
    node = node?.[p]
    if (!node) return key
  }
  if (typeof node === 'string' && params && typeof params === 'object') {
    return node.replace(/\{\{(\w+)\}\}/g, (_, name) => String(params[name] ?? ''))
  }
  return node
}
