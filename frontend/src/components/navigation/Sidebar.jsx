import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

import { useUser } from "../../store/UserStore"
import { useProfile } from "../../store/ProfileStore"
import { useNotifications } from "../../store/NotificationStore"
import { useGoals } from "../../store/GoalsStore"

import Icon from "../ui/Icon"
import Logo from "../navigation/Logo"

import "./Sidebar.css"

const navItems = [
    { to: "/", icon: "home", label: "Home", end: true},
    { to: "/transactions", icon: "transactions", label: "Transactions"},
    { to: "/goals", icon: "goals", label: "Saving Goals", expandable: true},
    { to: "/journey", icon: "categories", label: "Journey"},
    { to: "/challenges", icon: "profile", label: "Challenges"},
    { to: "/rewards", icon: "gem", label: "Rewards"},
    { to: "/notifications", icon: "notifications", label: "Notifications"}
]

function Sidebar() {
    const navigate = useNavigate()

    const { user } = useUser()
    const { stats } = useProfile()
    const { goals } = useGoals()
    const { notifications } = useNotifications()

    const [isGoalsExpanded, setIsGoalsExpanded] = useState(false)

    const unreadCount = notifications.filter(n => !n.read).length
    const streak = stats?.streak || 0
    const levelTitle = stats?.levelTitle || ""

    const initial  = user.displayName ? user.displayName.charAt(0).toUpperCase() : "?"

    function toggleGoals(e) {
        e.preventDefault()
        e.stopPropagation()
        setIsGoalsExpanded(prev => !prev)
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <Logo className="sidebar-logo" />
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ to, icon, label, end, expandable }) => (
                    <div key={to} className="sidebar-item-group">
                        <NavLink
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
                        
                            {expandable && (
                                <button
                                    className={`sidebar-expand-btn ${isGoalsExpanded ? "sidebar-expand-btn--open" : ""}`}
                                    onClick={toggleGoals}
                                    aria-label={isGoalsExpanded ? "Collapse saving goals" : "Expand saving goals"}
                                >
                                    <Icon name="select" size={16} />
                                </button>
                            )}
                        </NavLink>

                        {expandable && isGoalsExpanded && (
                            <div className="sidebar-subitems">
                                {goals.length === 0 ? (
                                    <button
                                        className="sidebar-subitem sidebar-subitem--empty"
                                        onClick={() => navigate("/goals/add")}
                                    >
                                        Add your first goal
                                    </button>
                                ) : (
                                    goals.slice(0, 4).map(goal => {
                                        const progress = goal.target_amount > 0
                                            ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
                                            : 0

                                        return (
                                            <NavLink
                                                key={goal.id}
                                                to={`/goals/edit/${goal.id}`}
                                                className="sidebar-subitem"
                                            >
                                                <span className="sidebar-subitem-name">
                                                    {goal.name}
                                                </span>

                                                <span className="sidebar-subitem-progress">
                                                    {progress}
                                                </span>
                                            </NavLink>
                                        )
                                    })
                                )}
                            </div>
                        )}
                    </div>
                    
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