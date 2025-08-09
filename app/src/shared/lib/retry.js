export async function retry(fn, { retries = 2, delayMs = 300, factor = 2 } = {}) {
  let attempt = 0
  let currentDelay = delayMs
  // Экспоненциальный бекофф, простой и надёжный
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn()
    } catch (error) {
      if (attempt >= retries) throw error
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, currentDelay))
      currentDelay *= factor
      attempt += 1
    }
  }
}
