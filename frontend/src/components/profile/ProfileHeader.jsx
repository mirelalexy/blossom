import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"

import Button from "../ui/Button"
import Icon from "../ui/Icon"

import "../../styles/components/ProfileHeader.css"

function ProfileHeader({ bannerSrc, avatarSrc, name, email, isEditing, onEditToggle, onAvatarClick, onBannerClick, onRemoveAvatar, onRemoveBanner, bannerPositionY = 50, onBannerPositionChange, streak }) {
    const navigate = useNavigate()
    const initial = name ? name.charAt(0).toUpperCase() : "?"

    const [isRepositioning, setIsRepositioning] = useState(false)
    // store temporary position while dragging
    const [dragPositionY, setDragPositionY] = useState(bannerPositionY)
    const [isSaving, setIsSaving] = useState(false)

    // remember where the current drag started
    const dragStartRef = useRef(null)
    const bannerRef = useRef(null)

    // preview the banner position while dragging
    const displayPositionY = isRepositioning ? dragPositionY : bannerPositionY

    function startRepositioning() {
        // reset back to currently saved value first
        setDragPositionY(bannerPositionY)
        setIsRepositioning(true)
    }

    function cancelRepositioning() {
        setIsRepositioning(false)
        dragStartRef.current = null
    }

    async function saveRepositioning() {
        setIsSaving(true)

        try {
            await onBannerPositionChange(dragPositionY)
            setIsRepositioning(false)
        } catch (err) {
            console.error("Failed to save banner position: ", err)
        } finally {
            setIsSaving(false)
            dragStartRef.current = null
        }
    }

    function handlePointerDown(e) {
        if (!isRepositioning) return

        dragStartRef.current = {
            pointerY: e.clientY,
            startPositionY: dragPositionY
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
        setDragPositionY(Math.round(next))
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
                        style={{ objectPosition: `50% ${displayPositionY}%` }}
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

                {isRepositioning ? (
                    <div className="profile-banner-actions">
                        <button 
                            className="profile-media-btn" 
                            onClick={saveRepositioning} 
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Position"}
                        </button>

                        <button
                            className="profile-media-btn profile-media-btn--remove"
                            onClick={cancelRepositioning}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                ) : isEditing && (
                    <div className="profile-banner-actions">
                        <button 
                            className="profile-media-btn" 
                            onClick={onBannerClick}
                        >
                            {bannerSrc ? "Change banner" : "Add banner"}
                        </button>

                        {bannerSrc && (
                            <button
                                className="profile-media-btn"
                                onClick={startRepositioning}
                            >
                                Reposition
                            </button>
                        )}

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