import type { NextPage } from 'next'
import { Default } from 'components/layouts/Default';
import {Chat} from 'components/templates/dm'
const BlankConversation: NextPage = () => {
    
    return(
        <Default pageName="ERC20 Transfers">
            <Chat/>
        </Default>
    )
  
}

export default BlankConversation
