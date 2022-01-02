import { MetaMaskInpageProvider } from "@metamask/providers";
import { contractFactory } from "../util/contractFactory";
import { atom } from "jotai";

type GlobalState = {
	metaMaskInstance?: MetaMaskInpageProvider;
	isUserConnected?: boolean;
	contractError?: string;
	isContractOwner?: boolean;
	playerCount?: number;
	isPlayerCountLoading?: boolean;
};

export const globalAtom = atom<GlobalState>({
	metaMaskInstance: window?.ethereum,
	isUserConnected: false,
});

type Player = {
	playerCount?: number;
	playerLoading?: boolean;
};

export const playerAtom = atom<Player>({});

export const fetchPlayerAtom = atom(
	(get) => get(playerAtom),
	async (_get, set) => {
		if (_get(globalAtom).isUserConnected) {
			const lotteryContract = contractFactory();
			set(playerAtom, { playerLoading: true });
			const response = await lotteryContract.playersCount();
			set(playerAtom, { playerLoading: false, playerCount: response.toNumber() });
		}
	}
);
