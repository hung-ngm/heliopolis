import React, { useEffect, useState, useContext, Fragment } from 'react'
import { classNames } from 'components/helpers/'
import messageComposerStyles from '@styles/MessageComposer.module.css'//'../../../styles/MessageComposer.module.css'
import upArrowGreen from '@public/up-arrow-green.svg'
import upArrowGrey from '@public/up-arrow-grey.svg'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react';
import Loader from 'components/chat/Loader';
import { WalletContext } from 'components/contexts/wallet';
import { ethers } from 'ethers';

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>
}

type SupportedChain = "aurora" | "Avalanche" | "binance" | "goerli" | "Fantom" | "Moonbeam" | "Polygon"
type SupportedToken = "wAXL" | "WMATIC" | "WFTM" | "axlWETH" | "WAVAX" | "WDEV" | "aUSDC" | "WBNB"

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState<SupportedToken>();
  const [sourceChain, setSourceChain] = useState<SupportedChain>();
  const [destChain, setDestChain] = useState<SupportedChain>();
  const router = useRouter();
  const {
    address: walletAddress,
    signer,
  } = useContext(WalletContext);
  

  console.log('walletAddress', walletAddress);
  console.log('signer', signer);


  // The registry of all token contracts
  const tokenRegistry: { [token in SupportedToken]: { [chain in SupportedChain]: string }} = {
    "wAXL": {
      "aurora": "0x1AA14c03783e3C31b14615a83a58E1eAF98Bf596",
      "Avalanche": "0xa8B51e6517f9A6Ab7b247bF10b71b1A738eD8E50",
      "binance": "0xfC3B4feb754d8082F745940347600D373f03dcaC",
      "goerli": "0x23ee2343B892b1BB63503a4FAbc840E0e2C6810f",
      "Fantom": "0x66A5df72619982a2Ef49e8317079b6806d56f66B",
      "Moonbeam": "0xB4D56B6AD4DD2B48e68D2a26C25A04dC1c0eE393",
      "Polygon": "0x9c79782d2B13CAC0Fa2FB00D188104fe6f98E533",
    },
    "WMATIC": {
      "aurora": "0x56F1a7a69e5Aa09C1A6ee1AC9989e931cA906EB1",
      "Avalanche": "0xB923E2374639D0605388D91CFedAfCeCE03Cfd8f",
      "binance": "0x920fA0DbB65cE928C29103AeC7B5c188bbea2f24",
      "goerli": "0x21ba4f6aEdA155DD77Cc33Fb93646910543F0380",
      "Fantom": "0x3C12d813bb36295A8361C4740A732Bb700df6Db0",
      "Moonbeam": "0xde3dB4FD7D7A5Cc7D8811b7BaFA4103FD90282f3",
      "Polygon": "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    },
    "WFTM": {
      "aurora": "0x0660F60B6cC54a3E1e526113a1D25d516273AF3E",
      "Avalanche": "0xeF721BaBf08A2eE5BCcfd2f2A34CbF4Dc9A56959",
      "binance": "0x90dEcD89a744a0CFbB3cc8DE08A5f3B14875B6C4",
      "goerli": "0x594D8b81eC765410536ab59E98091700b99508D8",
      "Fantom": "0x812666209b90344Ec8e528375298ab9045c2Bd08",
      "Moonbeam": "0x40EebD34eC6CB4C0644a18494365171b1dcE97eb",
      "Polygon": "0x62b6F2A4eE6a4801bfcD2056d19c6d71654D2582",
    },
    "axlWETH": {
      "aurora": "",
      "Avalanche": "0xe840BE8D9aB1ACD5AfC7168b05EC350B7FD18709",
      "binance": "0x409A57A5Ee1F37FB58b3A3eB9717398F328da1eD",
      "goerli": "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
      "Fantom": "0xB17053aE763aCfD65A58e265aa9A4a59b25A7a87",
      "Moonbeam": "0x4faB8Ad67eF3173501c512B9367f0B0f62287fE7",
      "Polygon": "0x786D82A436EA836A8669919D605FfeaEFa51744e",
    },
    "WAVAX": {
      "aurora": "",
      "Avalanche": "",
      "binance": "",
      "goerli": "",
      "Fantom": "",
      "Moonbeam": "",
      "Polygon": "",
    },
    "WDEV": {
      "aurora": "0xb47BAb33cAE8FCa71FA28516ADCE3AF0B3e040e3",
      "Avalanche": "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
      "binance": "0x1B29EC62efC689c462b4E0512457175793cEc9e6",
      "goerli": "0x2a87806561C550ba2dA9677c5323413E6e539740",
      "Fantom": "0x8776aDD48553518641a589C39792cc409d4C8B84",
      "Moonbeam": "0x64aae6319934995Bf30e67EBBBA9750256E07283",
      "Polygon": "0x6DD60c05FdA1255A44Ffaa9A8200b5b179A578D6",
    },
    "aUSDC": {
      "aurora": "0xFfB4749710EC6286b3A0dC2F24165DA622dA2ff5",
      "Avalanche": "0x57F1c63497AEe0bE305B8852b354CEc793da43bB",
      "binance": "0xc2fA98faB811B785b81c64Ac875b31CC9E40F9D2",
      "goerli": "0x254d06f33bDc5b8ee05b2ea472107E300226659A",
      "Fantom": "0x75Cc4fDf1ee3E781C1A3Ee9151D5c6Ce34Cf5C61",
      "Moonbeam": "0xD1633F7Fb3d716643125d6415d4177bC36b7186b",
      "Polygon": "0x2c852e740B62308c46DD29B982FBb650D063Bd07",
    },
    "WBNB": {
      "aurora": "0x57A2d26A9079AF0CdB7aEf83d6978a78192f94Ab",
      "Avalanche": "0xd020f566723e8402f925A891605c02ce7AF2477F",
      "binance": "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
      "goerli": "0xA9A2D8F279ABC436a18DBB1df3FB233039935D0A",
      "Fantom": "0x8DA729FC44366eFE36d522B865FeC34653e85F6e",
      "Moonbeam": "0x8d0BBbA567Ae73a06A8678e53Dc7ADD0AF6b7039",
      "Polygon": "0x55fDE07dEF3261a41fC59B783D27A6357e8A86Df",
    }
  }

  // All gateways of Axelar
  const gateWayRegistry: { [chain in SupportedChain]: string } = {
    "aurora": "0x304acf330bbE08d1e512eefaa92F6a57871fD895",
    "Avalanche": "0xC249632c2D40b9001FE907806902f63038B737Ab",
    "binance": "0x4D147dCb984e6affEEC47e44293DA442580A3Ec0",
    "goerli": "0xe432150cce91c13a887f7D836923d5597adD8E31",
    "Fantom": "0x97837985Ec0494E7b9C71f5D3f9250188477ae14",
    "Moonbeam": "0x5769D84DD62a6fD969856c75c7D321b84d455929",
    "Polygon": "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B"
  }

  const tokenAbi = ["function approve(address spender, uint256 amount) external returns (bool)"];
  const gatewayAbi = ["function sendToken(string memory destinationChain, string memory destinationAddress, string memory symbol, uint256 amount) external"];

  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const onTransfer = async () => {
    try {
      setLoading(true);
      const recipientWalletAddr = router.query.recipientWalletAddr as string
      // const testnetProvider = ethers.getDefaultProvider(sourceChain);

      // Not good practice since we need to allow users to authorize the transfer
      // const walletSigner = signer?.connect(testnetProvider) as ethers.Signer;
      if (sourceChain && token) {
        const gatewayAddress = gateWayRegistry[sourceChain];
        const tokenAddress = tokenRegistry[token][sourceChain];
        
        const gatewayContract = new ethers.Contract(gatewayAddress, gatewayAbi, signer);
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);

        // Approve the gateway to send token
        const approveTx = await tokenContract.approve(gatewayAddress, BigInt(Number(`${amount}e6`)));
        await approveTx.wait();

        // Use the gateway to send token
        const sendTx = await gatewayContract.sendToken(
          destChain,
          recipientWalletAddr,
          token,
          BigInt(Number(`${amount}e6`))
        )
        const res = await sendTx.wait();
        console.log('res', res);
        const transferMessage = `Send ${amount} ${token} from ${sourceChain} to ${destChain} successfully!`;
        setLoading(false);
        closeModal();
        await onSend(transferMessage);
      } 
    } catch (err) {
      console.log(err);
      setLoading(false);
      closeModal();
      window.alert(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTokenChanged = (e: any) => {
    setToken(e.target.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSourceChainChanged = (e: any) => {
    setSourceChain(e.target.value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDestChainChanged = (e: any) => {
    setDestChain(e.target.value);
  }

  const onMessageChange = (e: React.FormEvent<HTMLInputElement>) =>
    setMessage(e.currentTarget.value)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message) {
      return
    }
    setMessage('')
    await onSend(message)
  }

  return (
    <div
      className={classNames(
        'sticky',
        'bottom-0',
        'pl-4',
        'pt-2',
        'flex-shrink-0',
        'flex',
        'h-[68px]',
        'bg-white'
      )}
    >
      <form
        className={classNames(
          'flex',
          'w-full',
          'border',
          'py-2',
          'pl-4',
          'mr-3',
          messageComposerStyles.bubble
        )}
        autoComplete="off"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          placeholder="Type something..."
          className={classNames(
            'block',
            'w-full',
            'text-md',
            'md:text-sm',
            messageComposerStyles.input
          )}
          name="message"
          value={message}
          onChange={onMessageChange}
          required
        />
        <button type="submit" className={messageComposerStyles.arrow}>
          <img
            src={message ? upArrowGreen : upArrowGrey}
            alt="send"
            height={32}
            width={32}
          />
        </button>
      </form>
      <div className='mr-3'>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-blue-500 px-4 py-2 text-lg font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Transfer
        </button>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Cross chain transfer (Powered by Axelar)
                  </Dialog.Title>
                  <br/>
                  {!loading 
                    ? <div>
                      <label htmlFor="from">Origin Chain</label>
                      <select 
                        name="from" 
                        id="from" 
                        className='ml-20 px-3 py-1 pr-8 mb-2'
                        onChange={handleSourceChainChanged}
                      >
                        <option value="goerli">Ethereum Goerli</option>
                        <option value="polygon">Polygon Mumbai</option>
                      </select>
                      <br/>
                      <label htmlFor="to">Destination Chain</label>
                      <select 
                        name="to" 
                        id="to" 
                        className='ml-10 px-5 py-1 pr-8 mt-2'
                        onChange={handleDestChainChanged}
                      >
                        <option value="goerli">Ethereum Goerli</option>
                        <option value="polygon">Polygon Mumbai</option>
                      </select>
                      <br/>
                      <br/>
                      <label htmlFor="token">Token</label>
                      <select 
                        name="token" 
                        id="token" 
                        className='ml-32 px-3 py-1 pr-8 mt-2'
                        onChange={handleTokenChanged}
                      >
                        <option value="wAXL">wAXL</option>
                        <option value="WMATIC">WMATIC</option>
                        <option value="WFTM">WFTM</option>
                        <option value="axlWETH">axlWETH</option>
                        <option value="WAVAX">WAVAX</option>
                        <option value="WDEV">WDEV</option>
                        <option value="aUSDC">aUSDC</option>
                        <option value="WBNB">WBNB</option>
                      </select>
                      <br/>
                      <br/>
                      <label htmlFor="amount">Amount</label>
                      <input
                        type="text"
                        id="amount"
                        name="amount"
                        value={amount?.toString()}
                        placeholder="Amount of token"
                        className="bg-white-100 px-[10px] py-[7px] mt-[10px] rounded max-w-[400px] w-full text-black border-2 border-black"
                        onChange={e => setAmount(e.target.value)}
                      />

                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Seamless cross-chain payments by Axelar
                        </p>
                      </div>
                      <br/>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onTransfer}
                      >
                        Send to your friend
                      </button>
                      </div>
                    : <Loader
                        headingText="Sending tokens with Axelar..."
                        subHeadingText="Use your wallet to send transaction"
                        isLoading
                      />
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MessageComposer
