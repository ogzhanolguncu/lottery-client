import { MetaMaskInpageProvider } from "@metamask/providers";
import { proxy, ref } from "valtio";

type GlobalState = {
	metaMaskInstance?: MetaMaskInpageProvider;
	isUserConnected?: boolean;
	contractError?: string;
	isContractOwner?: boolean;
};

type Player = {
	playerCount?: number;
	isLoading?: boolean;
};

export const globalState = proxy<GlobalState>({
	metaMaskInstance: window.ethereum && ref(window.ethereum),
});

export const player = proxy<Player>();
