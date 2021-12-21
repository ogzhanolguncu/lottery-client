import React, { useCallback, useEffect, useState } from "react";
import { Flex, SkeletonText, Box, Button, Text, Stack } from "@chakra-ui/react";
import { ethers } from "ethers";

import useWalletConnected from "../hooks/useWalletConnected";
import { maskAddress, networkMatcher, NETWORK_IDS } from "../util";
import { contractFactory } from "../util/contractFactory";

const InfoBox = () => {
	const walletAddress = maskAddress(window.ethereum.selectedAddress);
	const walletNetwork = networkMatcher(window.ethereum.networkVersion);

	const [isContractOwner, setIsContractOwner] = useState(false);
	const [isContractOwnerLoading, setIsContractLoading] = useState(false);

	const [walletBalance, setWalletBalance] = useState<string>();
	const [isWalletBalanceLoading, setIsWalletBalanceLoading] = useState(false);

	const contractOwner = useCallback(async () => {
		if (window.ethereum.selectedAddress && window.ethereum.networkVersion === NETWORK_IDS.Ropsten) {
			setIsContractLoading(true);
			setIsContractOwner(
				(await contractFactory().owner()).toLowerCase() === window.ethereum.selectedAddress
			);
			setIsContractLoading(false);
		}
	}, []);

	const [isWalletConnected] = useWalletConnected();

	const connectToMetamask = async () => {
		try {
			await window.ethereum.request({
				method: "eth_requestAccounts",
			});
		} catch (err) {
			console.error(err);
		}
	};

	const getWalletBalance = useCallback(async () => {
		if (isWalletConnected) {
			const web3Provider = new ethers.providers.Web3Provider(window.ethereum as any);

			setIsWalletBalanceLoading(true);
			const walletsEtherAmount = Number(
				ethers.utils.formatEther(
					await web3Provider.getBalance(window.ethereum.selectedAddress || "")
				)
			).toFixed(4);

			setWalletBalance(walletsEtherAmount);
			setIsWalletBalanceLoading(false);
		}
	}, [isWalletConnected]);

	useEffect(() => {
		window.ethereum.on("accountsChanged", contractOwner);
		return () => {
			window.ethereum.removeListener("accountsChanged", contractOwner);
		};
	}, [contractOwner]);

	useEffect(() => {
		window.ethereum.on("chainChanged", (chainId) => {
			window.location.reload();
		});
	}, [contractOwner]);

	useEffect(() => {
		contractOwner();
		getWalletBalance();
	}, [contractOwner, getWalletBalance]);

	return (
		<Flex justifyContent={["center", "center", "flex-end", "flex-end"]} width="100%" padding="1rem">
			<Stack spacing="35px" direction={["column", "column", "row", "row"]}>
				<Flex>
					<SkeletonText isLoaded={isWalletConnected} noOfLines={3} width="80px" height="48px">
						<Box>
							Network <Text color="white">{walletNetwork}</Text>
						</Box>
					</SkeletonText>
					<SkeletonText
						marginLeft="35px"
						isLoaded={isWalletConnected && !isWalletBalanceLoading}
						noOfLines={3}
						width="120px"
						height="48px"
					>
						<Box>
							Wallet Balance <Text color="white">{walletBalance} ETH</Text>
						</Box>
					</SkeletonText>
				</Flex>
				<Flex>
					<SkeletonText
						isLoaded={isWalletConnected && !isContractOwnerLoading}
						noOfLines={3}
						width="70px"
						height="48px"
					>
						<Box>
							Address
							{isContractOwner ? <Text color="red.500">Owner</Text> : walletAddress}
						</Box>
					</SkeletonText>
					<Button onClick={connectToMetamask} color="#916BBF" marginLeft="35px">
						{isWalletConnected ? "Connected" : "Connect Wallet"}
					</Button>
				</Flex>
			</Stack>
		</Flex>
	);
};

export default InfoBox;
