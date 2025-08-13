import { z, ZodEnum } from 'astro/zod';
import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import {
	NationsSchema,
	PeopleSchema,
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

export const collections = {
	nations,
	people,
};
