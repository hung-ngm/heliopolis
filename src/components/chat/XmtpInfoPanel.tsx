import packageJson from '../../../package.json'
import { classNames } from '../helpers'
import {
  LinkIcon,
  UserGroupIcon,
  ChevronRightIcon,
  ArrowSmRightIcon,
} from '@heroicons/react/solid'
import { WalletContext } from '../contexts/wallet'
import { useContext } from 'react'
import { useRouter } from 'next/router';

type XmtpInfoRowProps = {
  icon: JSX.Element
  headingText: string
  subHeadingText: string
  onClick?: (() => void) | (() => Promise<void>)
  disabled?: boolean
}

type XmtpInfoPanelProps = {
  onConnect?: () => Promise<void>
}

const InfoRow = ({
  icon,
  headingText,
  subHeadingText,
  onClick,
  disabled,
}: XmtpInfoRowProps): JSX.Element => (
  <a
    onClick={disabled ? undefined : onClick}
    className={disabled ? 'cursor-auto' : 'cursor-pointer'}
  >
    <div
      className={classNames(
        disabled ? 'opacity-40' : '',
        'flex py-4 border border-x-0 border-y-zinc-50 justify-between items-stretch text-left'
      )}
    >
      <div className="h-10 w-10 bg-l-300 rounded-lg text-white p-2">{icon}</div>
      <div className="ml-3 flex-col justify-center text-md flex-1">
        <div className="font-semibold text-n-600">{headingText}</div>
        <div className="text-n-300">{subHeadingText}</div>
      </div>
      <div className="w-10 flex justify-end items-center pr-2">
        <ChevronRightIcon className="h-5" />
      </div>
    </div>
  </a>
)

const XmtpInfoPanel = ({ onConnect }: XmtpInfoPanelProps): JSX.Element => {
  const { address: walletAddress } = useContext(WalletContext)
  const router = useRouter();

  const InfoRows = [
    {
      icon: <LinkIcon />,
      headingText: 'Connect your wallet',
      subHeadingText: 'Verify your wallet to start using Chat in Heliopolis with XMTP Protocol',
      onClick: onConnect,
      disabled: !!walletAddress,
    },
    {
      icon: <UserGroupIcon />,
      headingText: 'NFT-gated chat',
      subHeadingText:
        'Exclusive group chat for NFT owners',
      // Onclick set onConnect then push to /chat/group
      onClick: async () => {
        if (onConnect) {
          await onConnect()
        }
        router.push('/chat/group');
      }
    },
  ]

  return (
    // The info panel is only shown in desktop layouts.
    <div className="hidden md:block m-auto w-[464px]">
      <div className="pb-6">
        <div className="text-xl text-n-600 font-semibold mb-1">
          Welcome to the web3 communication protocol
        </div>
        <div className="text-md text-n-300">
          Get started by reading the docs or joining the community
        </div>
      </div>
      <div>
        {InfoRows.map((info, index) => {
          return (
            <InfoRow
              key={index}
              icon={info.icon}
              headingText={info.headingText}
              subHeadingText={info.subHeadingText}
              onClick={info.onClick}
              disabled={info.disabled}
            />
          )
        })}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-n-600 text-sm">
          xmtp-js v{packageJson.dependencies['@xmtp/xmtp-js'].substring(1)}
        </div>
        <a
          href="chat_components/XmtpInfoPanel"
          target="_blank"
          className="text-l-300 font-semibold text-md flex items-center"
          rel="noreferrer"
        >
          I need help <ArrowSmRightIcon className="h-5 fill-l-300" />
        </a>
      </div>
    </div>
  )
}

export default XmtpInfoPanel
