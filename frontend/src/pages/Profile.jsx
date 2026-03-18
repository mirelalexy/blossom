import { useUser } from "../store/UserStore"

import ProfileHeader from "../components/profile/ProfileHeader"

function Profile() {
    const { user } = useUser()

    const user2 = {
        bannerSrc: "/banner.gif",
        avatarSrc: "/avatar.gif"
    }

    return (
        <div>
            <ProfileHeader 
                bannerSrc={user2.bannerSrc}
                avatarSrc={user2.avatarSrc}
                name={user.displayName}
                email={user.email}
            />
        </div>
    )
}

export default Profile