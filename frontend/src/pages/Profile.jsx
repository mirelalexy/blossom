import ProfileHeader from "../components/profile/ProfileHeader"

function Profile() {
    const user = {
        name: "lexy",
        email: "lexy@gmail.com",
        bannerSrc: "/banner.gif",
        avatarSrc: "/avatar.gif"
    }

    return (
        <div>
            <ProfileHeader 
                bannerSrc={user.bannerSrc}
                avatarSrc={user.avatarSrc}
                name={user.name}
                email={user.email}
            />
        </div>
    )
}

export default Profile