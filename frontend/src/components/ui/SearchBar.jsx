import Icon from "./Icon"

import "../../styles/components/SearchBar.css"

function SearchBar({ value, onChange }) {
    return (
        <div className="search-bar">
            <Icon name="search" size={18} />

            <input 
                type="text"
                placeholder="Search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

export default SearchBar