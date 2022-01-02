import create from "zustand";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { contractFactory } from "../util/contractFactory";

type GlobalState = {
	metaMaskInstance?: MetaMaskInpageProvider;
	isUserConnected?: boolean;
	contractError?: string;
	isContractOwner?: boolean;
	playerCount?: number;
	isPlayerCountLoading?: boolean;
	toggleUserConnection: (isConnected: boolean) => void;
	setContractError: (errorMessage: string) => void;
	setPlayerCount: (count: number) => void;
	setPlayerCountLoading: (loading: boolean) => void;
	setIsContractOwner: (isOwner: boolean) => void;
	fetchPlayerCount: () => Promise<void>;
};

export const useStore = create<GlobalState>((set) => ({
	metaMaskInstance: window.ethereum,
	isUserConnected: false,
	toggleUserConnection: (isConnected: boolean) => set(() => ({ isUserConnected: isConnected })),
	setContractError: (errorMessage: string) => set(() => ({ contractError: errorMessage })),
	setPlayerCount: (count: number) => set(() => ({ playerCount: count })),
	setPlayerCountLoading: (loading: boolean) => set(() => ({ isPlayerCountLoading: loading })),
	setIsContractOwner: (isOwner: boolean) => set(() => ({ isContractOwner: isOwner })),
	fetchPlayerCount: async () => {
		const lotteryContract = contractFactory();
		set({ isPlayerCountLoading: true });
		const response = await lotteryContract.playersCount();
		set({ isPlayerCountLoading: false, playerCount: response.toNumber() });
	},
}));
