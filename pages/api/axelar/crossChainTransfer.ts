/* eslint-disable @typescript-eslint/no-explicit-any */
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import { gatewayAbi, tokenAbi, SupportedChain, SupportedToken } from 'utils/axelar';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const crossChainTransfer = async (
    gatewayAddress: string, 
    tokenAddress: string, 
    recipientAddress: string,
    amount: string,
    destChain: SupportedChain | undefined,
    token: SupportedToken
): Promise<boolean> => {
    try{
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        
        const gatewayContract = new ethers.Contract(gatewayAddress, gatewayAbi, signer);
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

        // Approve the gateway to send token
        const approveTx = await tokenContract.approve(gatewayAddress, BigInt(Number(`${amount}e6`)));
        const approveRes = await approveTx.wait();
        console.log(approveRes);

        // Use the gateway to send token
        const sendTx = await gatewayContract.sendToken(
            destChain,
            recipientAddress,
            token,
            BigInt(Number(`${amount}e6`))
        );

        const sentTxReceipt = await sendTx.wait();
        console.log(sentTxReceipt);
        return true;
        
    }catch (e: any){
        console.log(e);
        return false;
    }

}