import { NavLink } from "react-router-dom"
import "./Bottombar.css"

import Icon from "../ui/Icon"

function Bottombar({ onAddTransaction }) {
    return (
        <nav className="bottombar">
            {/* Home */}
            <NavLink to="/" className="nav-item">
                <Icon name="home" />
            </NavLink>

            {/* Transactions */}
            <NavLink to="/transactions" className="nav-item">
                <Icon name="transactions" />
            </NavLink>

            {/* Add transaction */}
            <button onClick={onAddTransaction}>
                <Icon name="add" size={45} />
            </button>

            {/* Goals */}
            <NavLink to="/goals" className="nav-item">
                <Icon name="goals" />
           </NavLink>

           {/* Profile */}
            <NavLink to="/profile" className="nav-item">
                <Icon name="profile" />
           </NavLink>
        </nav>
    )
}

export default Bottombar