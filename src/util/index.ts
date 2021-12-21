export const CONTRACT_ADDRESS = "0xd67057b49eD38115A69d90ebcB6Fb6cDf49eD01F";

export const NETWORK_IDS = {
	Mainnet: "1",
	Kovan: "42",
	Ropsten: "3",
	Rinkeby: "4",
	Goerli: "5",
};

const NETWORKS = {
	Mainnet: "Mainnet",
	Kovan: "Kovan",
	Ropsten: "Ropsten",
	Rinkeby: "Rinkeby",
	Goerli: "Goerli",
};

export const networkMatcher = (networkId: string | null) => {
	switch (networkId) {
		case NETWORK_IDS.Goerli:
			return NETWORKS.Goerli;
		case NETWORK_IDS.Kovan:
			return NETWORKS.Kovan;
		case NETWORK_IDS.Ropsten:
			return NETWORKS.Ropsten;
		case NETWORK_IDS.Rinkeby:
			return NETWORKS.Rinkeby;
		case NETWORK_IDS.Mainnet:
			return NETWORKS.Mainnet;
		default:
			return "Network not found!";
	}
};

export const maskAddress = (address: string | null) => {
	if (address) {
		const addressHead = address.slice(0, 4);
		const addressTail = address.slice(-4, address.length);

		return `${addressHead}....${addressTail}`;
	}
};
