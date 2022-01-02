import { useAtom } from "jotai";
import { useEffect } from "react";
import { globalAtom } from "../store/globalStore";

const useWalletConnected = () => {
	const [, setState] = useAtom(globalAtom);
	useEffect(() => {
		const interval = setInterval(async () => {
			const accounts = (await window.ethereum?.request({
				method: "eth_accounts",
			})) as string[];
			if (accounts?.length > 0) {
				setState((prevState) => ({
					...prevState,
					isUserConnected: true,
					metaMaskInstance: window.ethereum,
				}));
			} else {
				setState({ isUserConnected: false });
			}
		}, 2000);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useWalletConnected;
