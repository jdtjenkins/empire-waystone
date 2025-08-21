import { z, ZodEnum } from 'astro/zod';
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import {
	NationsSchema,
	PeopleSchema,
	PlacesSchema,
	EventSchema
} from "./schemas/schemas"

const nations = defineCollection({
	schema: NationsSchema,
	loader: glob({
		pattern: "**/*.(md|mdx)",
		base: "./src/content/nations",
	}),
});

const people = defineCollection({
	schema: ({ image }) => PeopleSchema(image),
	loader: glob({
		pattern: "**/*.(md|mdx)",
		base: "./src/content/people",
	}),
})

const places = defineCollection({
	schema: ({ image }) => PlacesSchema(image),
	loader: glob({
		pattern: "**/*.(md|mdx)",
		base: "./src/content/places",
	}),
})

const events = defineCollection({
	schema: ({ image }) => EventSchema(image),
	loader: glob({
		pattern: "**/*.(md|mdx)",
		base: "./src/content/events",
	}),
})


export const collections = {
	nations,
	people,
	places,
	events,
};
