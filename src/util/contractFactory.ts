import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from ".";
import lotteryAbi from "../Contract/Lottery.json";
import { Lottery as LotteryType } from "../Contract/types/Lottery";

export const contractFactory = () => {
	const ethereum = window.ethereum;

	const web3Provider = new ethers.providers.Web3Provider(ethereum as any);
	const signer = web3Provider.getSigner();

	return new ethers.Contract(CONTRACT_ADDRESS, lotteryAbi, signer) as LotteryType;
};
