import React, { useEffect, useState, Fragment, useContext } from 'react'
import { classNames } from 'components/helpers/'
import messageComposerStyles from '@styles/MessageComposer.module.css'
import upArrowGreen from '../../../../public/up-arrow-green.svg'
import upArrowGrey from '../../../../public/up-arrow-grey.svg'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react';
import Loader from 'components/chat/Loader';
import { WalletContext } from 'components/contexts/wallet'
import { gatewayRegistry, tokenRegistry, SupportedToken, SupportedChain } from 'utils/axelar';
import { crossChainTransfer } from '@pages/api/axelar/crossChainTransfer';
import { transferNft } from '@pages/api/nft/transferNft'
import Link from 'next/link';

type MessageComposerProps = {
  onSend: (msg: string) => Promise<void>
}

const MessageComposer = ({ onSend }: MessageComposerProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isNftOpen, setIsNftOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nftLoading, setNftLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [token, setToken] = useState<SupportedToken>();
  const [sourceChain, setSourceChain] = useState<SupportedChain>();
  const [destChain, setDestChain] = useState<SupportedChain>();
  const router = useRouter();

  const { address: walletAddress } = useContext(WalletContext);
  

    
  useEffect(() => setMessage(''), [router.query.recipientWalletAddr])

  const closeModal = () => {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsOpen(true);
  }

  const openNftModal = () => {
    setIsNftOpen(true);
  }

  const closeNftModal = () => {
    setIsNftOpen(false);
  }


  const onTransfer = async () => {
    try {
      setLoading(true);
      const recipientWalletAddr = router.query.recipientWalletAddr as string
      if (sourceChain && token) {
        const gatewayAddress = gatewayRegistry[sourceChain];
        const tokenAddress = tokenRegistry[token][sourceChain];
        const canTransfer = await crossChainTransfer(gatewayAddress, tokenAddress, recipientWalletAddr, amount, destChain, token);
        console.log('can cross chain transfer ?', canTransfer);
        if (canTransfer) {
          const transferMessage = `Send ${amount} ${token} from ${sourceChain} to ${destChain} successfully!`;
          await onSend(transferMessage);
          setLoading(false);
        }
        
      } 
    } catch (err) {
      console.log(err);
      setLoading(false);
      closeModal();
      // eslint-disable-next-line no-alert
      window.alert(err);
    }
  }

  const onTransferNft = async () => {
    if (tokenId && walletAddress) {
      setNftLoading(true);
      const recipientWalletAddr = router.query.recipientWalletAddr as string
      const canTransferNft = await transferNft(walletAddress, recipientWalletAddr, Number(tokenId))
      console.log('can transfer nft?', canTransferNft);
      if (canTransferNft) {
        const transferMessage = `Send NFT ${tokenId} successfully!`;
        await onSend(transferMessage);
        setNftLoading(false);
      }
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
            'text-black',
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
      <div className='mr-1'>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-blue-500 px-4 py-2 text-lg font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Transfer
        </button>
      </div>
      <div className='mr-1'>
        <button
          type="button"
          onClick={openNftModal}
          className="rounded-md bg-blue-500 px-2 py-2 text-lg font-small text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          NFT
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
                    className="text-xl font-medium leading-6 text-black"
                  >
                    Cross chain transfer (Powered by Axelar)
                  </Dialog.Title>
                  <br/>
                  {!loading 
                    ? <div>
                      <label htmlFor="from" className='text-black'>Origin Chain</label>
                      <select 
                        name="from" 
                        id="from" 
                        className='ml-20 px-3 py-1 pr-8 mb-2 text-black'
                        onChange={handleSourceChainChanged}
                      >
                        <option value="goerli">Ethereum Goerli</option>
                        <option value="Polygon">Polygon Mumbai</option>
                      </select>
                      <br/>
                      <label htmlFor="to" className='text-black'>Destination Chain</label>
                      <select 
                        name="to" 
                        id="to" 
                        className='ml-10 px-5 py-1 pr-8 mt-2 text-black'
                        onChange={handleDestChainChanged}
                      >
                        <option value="goerli">Ethereum Goerli</option>
                        <option value="Polygon">Polygon Mumbai</option>
                      </select>
                      <br/>
                      
                      <label htmlFor="token" className='text-black'>Token</label>
                      <select 
                        name="token" 
                        id="token" 
                        className='ml-32 px-3 py-1 pr-8 mt-2 text-black'
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
                      <label htmlFor="amount" className='text-black'>Amount</label>
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
                        <p className="text-sm text-gray-500 mb-3">
                          Seamless cross-chain payments by Axelar
                        </p>
                      </div>
                      <br/>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-md font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onTransfer}
                      >
                        Send to your friend
                      </button>
                      </div>
                    : <Loader
                        headingText="Sending tokens with Axelar..."
                        subHeadingText="Transaction may take a while ..."
                        isLoading
                      />
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isNftOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeNftModal}>
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
                    className="text-xl font-medium leading-6 text-black"
                  >
                    Send NFT to your friend
                  </Dialog.Title>
                  <br/>
                  {!nftLoading 
                    ? <div>
                        <label htmlFor="amount" className='text-black'>Token Id (Heliopolis NFT)</label>
                        <input
                          type="text"
                          id="amount"
                          name="amount"
                          value={tokenId?.toString()}
                          placeholder="Token Id of Heliopolis NFT you own"
                          className="bg-white-100 px-[10px] py-[7px] mt-[10px] rounded max-w-[400px] w-full text-black border-2 border-black"
                          onChange={e => setTokenId(e.target.value)}
                        />
                     
                      <br/>
                      <br/>
                      
                      <Link href="/marketplace/collection">
                        <a className='text-black underline'>See your NFT balance here</a>
                      </Link>
                     
                      <br/>
                      <br/>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-md font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={onTransferNft}
                      >
                        Send NFT to your friend
                      </button>
                      </div>
                    : <Loader
                        headingText="Sending NFT to your friend"
                        subHeadingText="Transaction may take a while ..."
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
