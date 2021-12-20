import { useEffect, useState } from "react";

const useWalletConnected = () => {
	const [isWalletConected, setIsWalletConnected] = useState(false);

	useEffect(() => {
		const interval = setInterval(async () => {
			const accounts = (await window.ethereum.request({
				method: "eth_accounts",
			})) as string[];
			if (accounts?.length > 0) setIsWalletConnected(true);
			else setIsWalletConnected(false);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	return [isWalletConected, setIsWalletConnected] as const;
};

export default useWalletConnected;
