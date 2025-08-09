export async function retry(fn, { retries = 2, delayMs = 300, factor = 2 } = {}) {
    let attempt = 0
    let currentDelay = delayMs
    // Простой экспоненциальный бэкофф: повторяем попытку несколько раз
    // с увеличением задержки между попытками. Бесконечный цикл
    // завершается через return или после исчерпания попыток.
    while (true) {
        try {
            return await fn()
        } catch (error) {
            if (attempt >= retries) throw error
            await new Promise((r) => setTimeout(r, currentDelay))
            currentDelay *= factor
            attempt += 1
        }
    }
}
