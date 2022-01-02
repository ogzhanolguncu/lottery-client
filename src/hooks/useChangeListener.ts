import { ethers } from "ethers";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { globalAtom } from "../store/globalStore";
import { NETWORK_IDS } from "../util";
import { contractFactory } from "../util/contractFactory";

const useChangeListener = () => {
	const [{ metaMaskInstance, isUserConnected }, setState] = useAtom(globalAtom);

	const [isContractOwnerLoading, setIsContractLoading] = useState(false);

	const [walletBalance, setWalletBalance] = useState<string>();
	const [isWalletBalanceLoading, setIsWalletBalanceLoading] = useState(false);

	const isRopsten = metaMaskInstance
		? metaMaskInstance.networkVersion === NETWORK_IDS.Ropsten
		: false;

	const contractOwner = useCallback(async () => {
		if (isRopsten && metaMaskInstance?.selectedAddress) {
			setIsContractLoading(true);
			const contractOwner =
				(await contractFactory().owner()).toLowerCase() === metaMaskInstance?.selectedAddress;
			setState((prevState) => ({ ...prevState, isContractOwner: contractOwner }));

			setIsContractLoading(false);
		}
	}, [isRopsten, metaMaskInstance?.selectedAddress, setState]);

	const getWalletBalance = useCallback(async () => {
		if (isUserConnected) {
			const web3Provider = new ethers.providers.Web3Provider(metaMaskInstance as any);

			setIsWalletBalanceLoading(true);
			const walletsEtherAmount = Number(
				ethers.utils.formatEther(
					await web3Provider.getBalance(metaMaskInstance?.selectedAddress || "")
				)
			).toFixed(4);

			setWalletBalance(walletsEtherAmount);
			setIsWalletBalanceLoading(false);
		}
	}, [isUserConnected, metaMaskInstance]);

	useEffect(() => {
		contractOwner();
		getWalletBalance();
	}, [contractOwner, getWalletBalance]);

	useEffect(() => {
		metaMaskInstance?.on("accountsChanged", contractOwner);
		return () => {
			metaMaskInstance?.removeListener("accountsChanged", contractOwner);
		};
	}, [contractOwner, metaMaskInstance]);

	useEffect(() => {
		metaMaskInstance?.on("chainChanged", () => {
			window.location.reload();
		});
	}, [contractOwner, metaMaskInstance]);

	return [{ isContractOwnerLoading, walletBalance, isWalletBalanceLoading }];
};

export default useChangeListener;
