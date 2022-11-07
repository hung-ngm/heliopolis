/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import React, { useState, Fragment, useContext, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Loader from 'components/chat/Loader'
import { WalletContext } from 'components/contexts/wallet'
import { EvmChain } from '@moralisweb3/evm-utils';
import Moralis from 'moralis';


const Group: FC = () => {
  const {
    address: walletAddress
  } = useContext(WalletContext)
  const [userNfts, setUserNfts] = useState([]);

  useEffect(() => {
    const fetchUserNfts = async () => {
      if (walletAddress) {
        await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

        const nftBalances = await Moralis.EvmApi.nft.getWalletNFTs({
          address: walletAddress,
          chain: EvmChain.MUMBAI,
        });
        const nfts = JSON.parse(JSON.stringify(nftBalances.result));
        console.log('nfts', nfts);
        setUserNfts(nfts)
      }
    }
    fetchUserNfts();
  }, [userNfts, walletAddress])

  const [isOpen, setIsOpen] = useState(true)

  const [collection, setCollection] = useState('')
  const [loading, setLoading] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  // Check access to NFT using Moralis API
  const checkAccess = async () => {
    setLoading(true)
    if (userNfts) {
      console.log("collection", collection);
      const as = userNfts?.find((a: any) => a?.tokenAddress === collection.toLowerCase()) as any;
      if (as) {
        alert("Access granted. Welcome to exclusive chat!");
        closeModal();
      } else {
        alert("Access denied. You do not own an NFT from this collection");
      }
    } else {  
      alert("Access denied. You do not own an NFT from this collection");
    }
    setLoading(false)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Check Access
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
                    className="text-xl font-semibold leading-6 text-gray-900"
                  >
                    NFT-gated access Chat
                  </Dialog.Title>
                  <br/>
                  {!loading 
                  ? <Fragment>
                      <div className="mt-2">
                        <label htmlFor="collection">NFT Collection</label>
                        <input
                          type="text"
                          id="collection"
                          name="collection"
                          value={collection}
                          placeholder="Enter NFT contract address"
                          className="bg-white-100 px-[10px] py-[7px] mt-[10px] rounded max-w-[400px] w-full text-black border-2 border-black"
                          onChange={e => setCollection(e.target.value)}
                        />
                      </div>
                      <br/>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-md font-medium text-black hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={checkAccess}
                        >
                          Check Access
                        </button>
                      </div>
                    </Fragment>
                  : <Loader
                      headingText="Querying API..."
                      subHeadingText="Checking NFT ownership"
                      isLoading
                    />
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Group