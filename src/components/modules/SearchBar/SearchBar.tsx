import { Select } from 'antd';
// import { useMoralisDapp } from "providers/MoralisDappProvider/MoralisDappProvider";
// import { getCollectionsByChain } from "helpers/collections";
import { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
    setInputValue: Dispatch<SetStateAction<string>>;
}

function SearchBar({ setInputValue } : SearchBarProps){
    // const { Option } = Select;
    // const { chainId } = useMoralisDapp();
    // const NFTCollections = getCollectionsByChain(chainId);
    
    

    function onChange(value : string) {
        setInputValue(value);
    }

    return (
        <>
        <Select
            showSearch
            style={{width: "500px",
                    marginLeft: "20px" }}
            placeholder="Find a Collection"
            optionFilterProp="children"
            onChange={onChange}
        >   
        {/* {NFTCollections && 
            NFTCollections.map((collection, i) => 
            <Option value={collection.addrs} key= {i}>{collection.name}</Option>
            )
            }    */}
        </Select>
            
        </>
    )
}
export default SearchBar;