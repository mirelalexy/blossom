import { useState, useRef } from "react"

import { useUser } from "../store/UserStore"

import ProfileHeader from "../components/profile/ProfileHeader"

function Profile() {
    const { user, updateUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    
    const avatarRef = useRef()
    const bannerRef = useRef()

    function handleUpload(e, type) {
        const file = e.target.files[0]
        if (!file) return

        const maxSize = type === "banner"
            ? 5 * 1024 * 1024
            : 2 * 1024 * 1024
        
        if (file.size > maxSize) {
            alert("File too large.")
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            updateUser(type, reader.result)
        }

        reader.readAsDataURL(file)

        // reset input in case of re-uploading
        e.target.value = ""
    }

    function handleRemove(type) {
        updateUser(type, "")
    }

    return (
        <div>
            <ProfileHeader 
                bannerSrc={user.banner}
                avatarSrc={user.avatar}
                name={user.displayName}
                email={user.email}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(prev => !prev)} 
                onAvatarClick={() => avatarRef.current.click()}
                onBannerClick={() => bannerRef.current.click()}
                onRemoveAvatar={() => handleRemove("avatar")}
                onRemoveBanner={() => handleRemove("banner")}
            />

            <input
                type="file"
                accept="image/*"
                ref={avatarRef}
                style={{ display: "none " }}
                onChange={(e) => handleUpload(e, "avatar")}
            />

            <input
                type="file"
                accept="image/*"
                ref={bannerRef}
                style={{ display: "none " }}
                onChange={(e) => handleUpload(e, "banner")}
            />
        </div>
    )
}

export default Profile