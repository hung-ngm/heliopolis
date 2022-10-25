import { classNames, shortAddress } from '../src/helpers'
import useEns from '../src/hooks/useEns'

type AddressProps = {
  address: string
  className?: string
}

const Address = ({ address, className }: AddressProps): JSX.Element => {
  const { name, loading } = useEns(address)

  return (
    <span
      className={classNames(
        className || '',
        'font-mono',
        loading ? 'animate-pulse' : ''
      )}
      title={address}
    >
      {name || shortAddress(address)}
    </span>
  )
}

export default Address
