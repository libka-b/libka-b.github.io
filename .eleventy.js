import markdownit from 'markdown-it'
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight'

export default function (config) {
    // Adds syntax highlighting.
    // Different highlighting styles can be found here:
    // https://github.com/PrismJS/prism-themes/tree/master
    config.addPlugin(syntaxHighlight)

    config.addFilter('toDate', (dateValue) => {
        const date = new Date(dateValue)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        }).toString()
    })

    // Creates a new function usable within templates as `| md`.
    config.addFilter('md', (content = '') => {
        return markdownit({ html: true })
            .render(content)
    })

    // Makes corresponding directories copied as is.
    config.addPassthroughCopy('./src/images')
    config.addPassthroughCopy('./src/assets')

    // Creates new collection `posts` available within the templates.
    config.addCollection('posts', (collection) => {
        return collection
            .getFilteredByGlob('./src/posts/*.md')
            // reverse string sort
            .sort((a, b) => b.date - a.date)
    })

    // Sets delimiter for excerpt.
    config.setFrontMatterParsingOptions({
		excerpt: true,
		excerpt_separator: '<!-- excerpt -->',
	})

	return {
        markdownTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
		dir: {
			input: 'src',
			output: 'dist',
		},
	}
}