import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email, isEditing, onEditToggle, onAvatarClick, onBannerClick, onRemoveAvatar, onRemoveBanner, streak }) {
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
                    <div className="overlay">
                        <span onClick={onBannerClick}>Change Banner</span>

                        {bannerSrc && (
                            <span
                                className="remove"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveBanner()
                                }}
                            >
                                Remove
                            </span>
                        )}
                    </div>
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
                        <div className="overlay">
                        <span onClick={onAvatarClick}>Change</span>

                        {avatarSrc && (
                            <span
                                className="remove"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRemoveAvatar()
                                }}
                            >
                                Remove
                            </span>
                        )}
                    </div>
                    )}
                </div>
                
                <div className="profile-info">
                    <div className="profile-user">
                        <div className="profile-identity">
                            <h2 className="profile-name">{name}</h2>
                            {streak > 0 && (
                                <div className="profile-streak">
                                    <Icon name="streak" size={13} />
                                    <span>{streak}</span>
                                </div>
                            )}
                        </div>
                        
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