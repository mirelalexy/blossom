import { NavLink, useNavigate } from "react-router-dom"

import { useUser } from "../../store/UserStore"
import { useProfile } from "../../store/ProfileStore"
import { useNotifications } from "../../store/NotificationStore"

import Icon from "../ui/Icon"

import "./Sidebar.css"

const navItems = [
    { to: "/", icon: "home", label: "Home", end: true},
    { to: "/transactions", icon: "transactions", label: "Transactions"},
    { to: "/goals", icon: "goals", label: "Saving Goals"},
    { to: "/journey", icon: "categories", label: "Journey"},
    { to: "/challenges", icon: "profile", label: "Challenges"},
    { to: "/rewards", icon: "gem", label: "Rewards"},
    { to: "/notifications", icon: "notifications", label: "Notifications"}
]

function Sidebar() {
    const navigate = useNavigate()

    const { user } = useUser()
    const { stats } = useProfile()
    const { notifications } = useNotifications()

    const unreadCount = notifications.filter(n => !n.read).length
    const streak = stats?.streak || 0
    const levelTitle = stats?.levelTitle || ""

    const initial  = user.displayName ? user.displayName.charAt(0).toUpperCase() : "?"

    return (
        <aside className="sidebar">
            <div className="sidebar-logo" onClick={() => navigate("/")}>
                <Icon name="categories" size={22} />
                <span>Blossom</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ to, icon, label, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) => `sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
                    >
                        <span className="sidebar-item-icon">
                            <Icon name={icon} size={20} />
                            {label === "Notifications" && unreadCount > 0 && (
                                <span className="sidebar-badge">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                        </span>
                        <span className="sidebar-item-label">{label}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                className="sidebar-add-btn"
                onClick={() => navigate("/transactions/add")}
            >
                <Icon name="add" size={18} />
                Log a transaction
            </button>

            <div className="sidebar-footer">
                <div
                    className="sidebar-user"
                    onClick={() => navigate("/profile")}
                    role="button"
                    tabIndex={0}
                >
                    <div className="sidebar-avatar">
                        {user?.avatar
                            ? <img src={user.avatar} alt="Profile" />
                            : <div className="sidebar-avatar-fallback">{initial}</div>
                        }
                    </div>

                    <div className="sidebar-user-info">
                        <p className="sidebar-user-name">{user?.displayName}</p>
                        <p className="sidebar-user-meta">
                            {streak > 0 ? `🔥 ${streak} day streak` : levelTitle}
                        </p>
                    </div>
                </div>

                <button
                    className="sidebar-settings-btn"
                    onClick={() => navigate("/settings")}
                    aria-label="Settings"
                >
                    <Icon name="settings" size={18} />
                </button>
            </div>
        </aside>
    )
}

export default Sidebar