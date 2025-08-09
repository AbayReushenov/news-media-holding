// Warn on hardcoded Cyrillic letters in JSX/text nodes to encourage i18n
const rule = {
  meta: {
    type: 'problem',
    docs: { description: 'disallow hardcoded Cyrillic user-facing strings' },
    schema: [],
    messages: {
      hardcoded: 'Avoid hardcoded Cyrillic user-facing text. Move to i18n dictionary.',
    },
  },
  create(context) {
    const cyrillicRegex = /[А-Яа-яЁё]/
    return {
      Literal(node) {
        if (typeof node.value === 'string' && cyrillicRegex.test(node.value)) {
          context.report({ node, messageId: 'hardcoded' })
        }
      },
      TemplateElement(node) {
        const raw = node.value && node.value.raw
        if (typeof raw === 'string' && cyrillicRegex.test(raw)) {
          context.report({ node, messageId: 'hardcoded' })
        }
      },
    }
  },
}

const plugin = {
  rules: {
    'no-hardcoded-cyrillic': rule,
  },
}

export default plugin
