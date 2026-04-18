import { NavLink, useNavigate } from "react-router-dom"

import { useUser } from "../../store/UserStore"

import Icon from "../ui/Icon"

import "./Sidebar.css"

const navItems = [
    { to: "/", icon: "home", label: "Home"},
    { to: "/transactions", icon: "transactions", label: "Transactions"},
    { to: "/add-transaction", icon: "add", label: "Add Transaction"},
    { to: "/goals", icon: "goals", label: "Saving Goals"},
    { to: "/challenges", icon: "profile", label: "Challenges"},
    { to: "/rewards", icon: "gem", label: "Rewards"}
]

function Sidebar() {
    const navigate = useNavigate()

    const { user } = useUser()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate("/")}>
                <Icon name="categories" size={22} />
                <span>Blossom</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === "/"}
                        className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
                    >
                        <Icon name={icon} size={22} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <div className="home-avatar-wrapper" onClick={() => navigate("/profile")}>
                        { user?.avatar ? (
                            <img src={user.avatar} className="home-avatar"/>
                        ) : (
                            <div className="avatar-placeholder"></div>
                        )}
                    </div>
                    
                    <div className="sidebar-user-name">
                        <p>{user?.displayName}</p>
                    </div>
                </div>

                <button className="sidebar-settings" onClick={() => navigate("/settings")} >
                    <Icon name="settings" size={20} />
                </button>
            </div>
        </aside>
    )
}

export default Sidebar