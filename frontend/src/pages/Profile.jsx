import { useState } from "react"

import { useUser } from "../store/UserStore"

import ProfileHeader from "../components/profile/ProfileHeader"

function Profile() {
    const { user } = useUser()
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div>
            <ProfileHeader 
                bannerSrc={user.banner}
                avatarSrc={user.avatar}
                name={user.displayName}
                email={user.email}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(prev => !prev)} 
            />
        </div>
    )
}

export default Profile