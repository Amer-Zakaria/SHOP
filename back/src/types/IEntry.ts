import type { UUID } from "node:crypto";

export interface IEntry {
	id: UUID;
	name: string;
}
