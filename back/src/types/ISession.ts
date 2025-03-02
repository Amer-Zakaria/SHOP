import type { UUID } from "node:crypto";
import type { IEntry } from "./IEntry.ts";
import type { IPlayer } from "./IPlayer.ts";

export interface ISession {
	id: UUID;
	players: IPlayer[];
	entries: IEntry[];
	selectedEntryId?: UUID;
	isSpinning: boolean;
	currentRotation: number;
	spinningProperties: ISpinningProperties;
}

export interface ISpinningProperties {
	targetRotation: number;
	startTime: number; //when the spinning starts
	duration: number;
}
