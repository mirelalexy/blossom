import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email }) {
    const navigate = useNavigate()

    return (
        <div className="profile-header">
            <div className="profile-banner">
                <img src={bannerSrc} alt="profile banner" />
                <div className="settings-btn" onClick={() => navigate("/settings")}>
                    <Icon name="settings"/>
                </div>
            </div>

            <div className="profile-header-content">
                <div className="profile-avatar">
                    <img src={avatarSrc} alt="avatar" />
                </div>
                
                <div className="profile-info">
                    <div className="profile-user">
                        <h2 className="profile-name">{name}</h2>
                        <p className="profile-email">{email}</p>
                    </div>
                    <Button>Edit profile</Button>
                </div>        
            </div>            
        </div>
    )
}

export default ProfileHeader