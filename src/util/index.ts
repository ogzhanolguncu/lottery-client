export const NETWORKS_IDS = {
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
		case NETWORKS_IDS.Goerli:
			return NETWORKS.Goerli;
		case NETWORKS_IDS.Kovan:
			return NETWORKS.Kovan;
		case NETWORKS_IDS.Ropsten:
			return NETWORKS.Ropsten;
		case NETWORKS_IDS.Rinkeby:
			return NETWORKS.Rinkeby;
		case NETWORKS_IDS.Mainnet:
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
