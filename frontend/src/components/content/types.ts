import type { Appearance, Talk } from '@/content/schema'

export type Language = Appearance['language']
export type ResourceType = NonNullable<Appearance['resources']>[number]['type']
export type { Appearance, Talk }
