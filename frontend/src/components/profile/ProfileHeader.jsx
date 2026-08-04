import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import Icon from "../ui/Icon"
import MediaEditMenu from "./MediaEditMenu"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email, isEditing, onAvatarClick, onBannerClick, onRemoveAvatar, onRemoveBanner, bannerPositionY = 50, onBannerPositionDrag, streak }) {
    const navigate = useNavigate()
    const initial = name ? name.charAt(0).toUpperCase() : "?"

    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
    const [bannerMenuOpen, setBannerMenuOpen] = useState(false)

    const [isRepositioning, setIsRepositioning] = useState(false)

    const avatarEditRef = useRef(null)
    const bannerEditRef = useRef(null)

    // remember where the current drag started
    const dragStartRef = useRef(null)
    const bannerRef = useRef(null)

    function handlePointerDown(e) {
        if (!isRepositioning) return

        dragStartRef.current = {
            pointerY: e.clientY,
            startPositionY: bannerPositionY
        }

        // move even if the pointer leaves the element
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    function handlePointerMove(e) {
        if (!isRepositioning || !dragStartRef.current || !bannerRef.current) return

        const { pointerY, startPositionY } = dragStartRef.current
        const containerHeight = bannerRef.current.offsetHeight

        // convert the pointer movement into a percentage of the banner height
        // so the saved position scales consistently across screen sizes
        const deltaPercent = ((e.clientY - pointerY) / containerHeight) * 100

        // dragging down should reveal more of the banner's top
        // decrease the object-position percentage and clamp the value between 0% and 100%
        const next = Math.min(100, Math.max(0, startPositionY - deltaPercent))

        // update the preview position
        onBannerPositionDrag(Math.round(next))
    }

    function handlePointerUp() {
        dragStartRef.current = null
    }

    return (
        <div className="profile-header">
            <div 
                className={`profile-banner ${isRepositioning ? "profile-banner--repositioning" : ""}`}
                ref={bannerRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                {bannerSrc ? (
                    <img 
                        src={bannerSrc} 
                        alt="Profile banner"
                        style={{ objectPosition: `50% ${bannerPositionY}%` }}
                        draggable={false}    
                    />
                ) : (
                    <div className="banner-placeholder"></div>
                )}
                
                {!isRepositioning && (
                    <button className="settings-btn" onClick={() => navigate("/settings")}>
                        <Icon name="settings"/>
                    </button>
                )}

                {isEditing && (
                    isRepositioning ? (
                        <button
                            className="media-icon-btn media-icon-btn--done"
                            onClick={() => setIsRepositioning(false)}
                        >
                            <Icon name="completed" size={16} />
                        </button>
                    ) : (
                        <div className="banner-icon-actions">
                            {bannerSrc && (
                                <button
                                    className="media-icon-btn"
                                    onClick={() => setIsRepositioning(true)}
                                    aria-label="Reposition banner"
                                >
                                    <Icon name="move" size={16} />
                                </button>
                            )}

                            <div className="media-icon-btn-wrap">
                                <button
                                    className="media-icon-btn"
                                    ref={bannerEditRef}
                                    onClick={() => setBannerMenuOpen(prev => !prev)}
                                    aria-label="Edit banner"
                                >
                                    <Icon name="edit" size={16} />
                                </button>

                                <MediaEditMenu 
                                    isOpen={bannerMenuOpen}
                                    onClose={() => setBannerMenuOpen(false)}
                                    onUpload={onBannerClick}
                                    onRemove={onRemoveBanner}
                                    hasImage={!!bannerSrc}
                                    title="Banner"
                                    anchorRef={bannerEditRef}
                                />
                            </div>
                        </div>
                    )
                )}
            </div>

            <div className="profile-header-content">
                <div className="profile-avatar-wrap">
                    <div className="profile-avatar">
                        {avatarSrc ? (
                            <img src={avatarSrc} alt="avatar" />
                        ) : (
                            <div className="avatar-placeholder">
                                <span className="avatar-initial">{initial}</span>
                            </div>
                        )}
                    </div>
                    
                    {isEditing && (
                        <div className="media-icon-btn-wrap avatar-edit-wrap">
                            <button
                                className="media-icon-btn"
                                ref={avatarEditRef}
                                onClick={() => setAvatarMenuOpen(prev => !prev)}
                                aria-label="Edit avatar"
                            >
                                <Icon name="edit" size={14} />
                            </button>

                            <MediaEditMenu 
                                isOpen={avatarMenuOpen}
                                onClose={() => setAvatarMenuOpen(false)}
                                onUpload={onAvatarClick}
                                onRemove={onRemoveAvatar}
                                hasImage={!!avatarSrc}
                                title="Avatar"
                                anchorRef={avatarEditRef}
                            />
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