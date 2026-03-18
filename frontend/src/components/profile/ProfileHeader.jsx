import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email, isEditing, onEditToggle }) {
    const navigate = useNavigate()

    return (
        <div className="profile-header">
            <div className="profile-banner">
                { bannerSrc ? (
                    <img src={bannerSrc} alt="profile banner" />
                ) : (
                    <div className="banner-placeholder"></div>
                )}
                
                <div className="settings-btn" onClick={() => navigate("/settings")}>
                    <Icon name="settings"/>
                </div>

                {isEditing && (
                    <div className="overlay">Change Banner</div>
                )}
            </div>

            <div className="profile-header-content">
                <div className="profile-avatar">
                    { avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" />
                    ) : (
                        <div className="avatar-placeholder"></div>
                    )}
                    
                    {isEditing && (
                        <div className="overlay">Change</div>
                    )}
                </div>
                
                <div className="profile-info">
                    <div className="profile-user">
                        <h2 className="profile-name">{name}</h2>
                        <p className="profile-email">{email}</p>
                    </div>

                    <Button onClick={onEditToggle}>
                        {isEditing ? "Done" : "Edit profile"}
                    </Button>
                </div>        
            </div>            
        </div>
    )
}

export default ProfileHeader