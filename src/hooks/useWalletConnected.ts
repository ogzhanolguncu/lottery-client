import { useEffect } from "react";
import { useStore } from "../store/globalStore";

const useWalletConnected = () => {
	const toggleUserConnection = useStore((state) => state.toggleUserConnection);
	useEffect(() => {
		const interval = setInterval(async () => {
			const accounts = (await window.ethereum?.request({
				method: "eth_accounts",
			})) as string[];
			if (accounts?.length > 0) {
				toggleUserConnection(true);
			} else {
				toggleUserConnection(false);
			}
		}, 2000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useWalletConnected;
