import { z, ZodEnum } from 'astro/zod';
import { type SchemaContext, reference } from 'astro:content';

export const NationsEnum = z.enum(["The Brass Coast", "Dawn", "Highguard", "Imperial Orcs", "The League", "The Marches", "Navarr", "Urizen", "Varushka", "Wintermark"])
export type NationsEnumType = z.infer<typeof NationsEnum>

export const Archetypes: Partial<Record<NationsEnumType, ZodEnum<[string, ...string[]]>>> = {
	[NationsEnum.Enum.Wintermark]: z.enum([
		"Thane",
		"Banner-Bearer",
		"Stormcrow",
		"Runesmith",
		"Icewalker",
		"Mediator",
		"Maggot",
		"Mystic",
		"Scop",
		"Grimnir",
	])
}
export const Cultures: Partial<Record<NationsEnumType, ZodEnum<[string, ...string[]]>>> = {
	[NationsEnum.Enum.Wintermark]: z.enum([
		"Kalavessi",
		"Steiner",
		"Suaq",
	])
}

export const NationsSchema = z.object({
	name: NationsEnum,
	coords: z.array(z.array(z.number())),
	colour: z.string(),
	notablePeople: z.array(reference("people")),
})

export const PeopleSchema = (image: SchemaContext["image"]) => z.object({
	name: z.string(),
	nation: NationsEnum,
	archetypes: z.array(z.string()).optional(),
	culture: z.string().optional(),
	titles: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	image: image().optional(),
	imageAlt: z.string(),
	pronouns: z.string().optional(),
})
	// Make sure the Archetype fits the nation
	.refine(
		({ nation, archetypes }) => {
			if (!archetypes) return true
			return (archetypes ?? [])
				.every(archetype => Archetypes[nation]?.safeParse(archetype).success)
		},
		({ nation, archetypes }) => {
			const disallowedArchetypes = (archetypes ?? [])
				.filter(archetype => !Archetypes[nation]?.safeParse(archetype).success)
			
			return {
				message: `${ nation } does not have ${ disallowedArchetypes.join(", ") }`
			}
		}
	)

	// Make sure the Culture fits the nation
	.refine(
		({ nation, culture }) => {
			if (!culture) return true
			return Cultures[nation]?.safeParse(culture).success
		}, 
		({ nation, culture }) => {
			return {
				message: `${ nation } does not contain culture: ${ culture }`, 
			}
		}
	)

export type Nation = z.infer<typeof NationsSchema>
export type Person = z.infer<ReturnType<typeof PeopleSchema>>
