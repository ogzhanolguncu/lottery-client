import { useEffect } from "react";
import { globalState } from "../store/globalStore";

const useWalletConnected = () => {
	useEffect(() => {
		const interval = setInterval(async () => {
			const accounts = (await window.ethereum?.request({
				method: "eth_accounts",
			})) as string[];
			if (accounts?.length > 0) {
				globalState.isUserConnected = true;
			} else {
				globalState.isUserConnected = false;
			}
		}, 2000);
		return () => clearInterval(interval);
	}, []);
};

export default useWalletConnected;
