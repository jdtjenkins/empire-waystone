import { type APIContext } from 'astro';
import { getCollection, getEntry, render } from 'astro:content'
import { getContainerRenderer as mdxContainerRenderer } from "@astrojs/mdx"
import { loadRenderers } from 'astro:container';
import { experimental_AstroContainer } from 'astro/container';


export async function GET ({ params, request}: APIContext) {
	const renderers = await loadRenderers([mdxContainerRenderer()])
	const container = await experimental_AstroContainer.create({
		renderers,
	})

	const nations = await getCollection("nations")
	const data: any = {}

	for (const nation of nations) {
		const entry = await getEntry(nation)
		const rendered = await render(entry)

		data[nation.id] = {
			data: nation.data,
			html: rendered,
		}

		console.log((await container.renderToString(rendered.Content)).trim())
	}

	return new Response(JSON.stringify(data))
}
