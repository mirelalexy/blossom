import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email, isEditing, onEditToggle, onAvatarClick, onBannerClick, onRemoveAvatar, onRemoveBanner, streak }) {
    const navigate = useNavigate()
    const initial  = name ? name.charAt(0).toUpperCase() : "?"

    return (
        <div className="profile-header">
            <div className="profile-banner">
                {bannerSrc ? (
                    <img src={bannerSrc} alt="Profile banner" />
                ) : (
                    <div className="banner-placeholder"></div>
                )}
                
                <button className="settings-btn" onClick={() => navigate("/settings")}>
                    <Icon name="settings"/>
                </button>

                {isEditing && (
                    <div className="profile-banner-actions">
                        <button className="profile-media-btn" onClick={onBannerClick}>
                            {bannerSrc ? "Change banner" : "Add banner"}
                        </button>

                        {bannerSrc && (
                            <button
                                className="profile-media-btn profile-media-btn--remove"
                                onClick={e => { 
                                    e.stopPropagation(); 
                                    onRemoveBanner() 
                                }}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="profile-header-content">
                <div className="profile-avatar">
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="avatar" />
                    ) : (
                        <div className="avatar-placeholder">
                            <span className="avatar-initial">{initial}</span>
                          </div>
                    )}
                    
                    {isEditing && (
                        <div className="profile-avatar-actions">
                            <button className="profile-media-btn profile-media-btn--sm" onClick={onAvatarClick}>
                                {avatarSrc ? "Change" : "Add"}
                            </button>

                            {avatarSrc && (
                                <button
                                    className="profile-media-btn profile-media-btn--sm profile-media-btn--remove"
                                    onClick={e => { 
                                        e.stopPropagation(); 
                                        onRemoveAvatar() 
                                    }}
                                >
                                    Remove
                                </button>
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
                </div>        
            </div>            
        </div>
    )
}

export default ProfileHeader