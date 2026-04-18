import { useState, useRef, useEffect } from "react"

import { useUser } from "../store/UserStore"
import { useProfile } from "../store/ProfileStore"
import { useRewards } from "../store/RewardStore"
import { useTasks } from "../store/TaskStore"

import ProfileHeader from "../components/profile/ProfileHeader"
import LevelCard from "../components/profile/LevelCard"
import ChallengesPreview from "../components/challenges/ChallengesPreview"
import RewardsCard from "../components/profile/RewardsCard"

import "../styles/pages/Profile.css"

function Profile() {
    const { user, uploadAvatar, uploadBanner } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    const { stats } = useProfile()
    const { rewards } = useRewards()
    const { tasks } = useTasks()

    // get ready and locked rewards
    const getTask = (id) => tasks.find(t => t.id === id)

    const isUnlocked = (reward) => {
        if (!reward.task_id) return true

        const task = getTask(reward.task_id)

        if (!task) return true // fallback if task deleted

        return task?.completed
    }

    const ready = rewards.filter(r => isUnlocked(r) && !r.claimed)
    const locked = rewards.filter(r => !isUnlocked(r))

    const streak = stats?.streak || 0
    const level = stats?.level || 1
    const levelTitle = stats?.levelTitle || "Mindful Seed"
    const progress = stats?.progress || 0

    const avatarRef = useRef()
    const bannerRef = useRef()
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)

    // prevent memory leaks
    useEffect(() => {
        return () => {
            if (avatarPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }, [avatarPreview])

    useEffect(() => {
        return () => {
            if (bannerPreview?.startsWith("blob:")) {
                URL.revokeObjectURL(bannerPreview)
            }
        }
    }, [bannerPreview])

    async function handleUpload(e, type) {
        const file = e.target.files[0]
        if (!file) return

        const maxSize = type === "banner"
            ? 5 * 1024 * 1024
            : 2 * 1024 * 1024
        
        if (file.size > maxSize) {
            alert("File too large.")
            return
        }

        const preview = URL.createObjectURL(file)

        try {
            if (type === "avatar") {
                setAvatarPreview(preview)
                await uploadAvatar(file)
                setAvatarPreview(null)
            } else {
                setBannerPreview(preview)
                await uploadBanner(file)
                setBannerPreview(null)
            }
        } catch (err) {
            console.log(err)
            alert("Upload failed.")

            // reset preview on failure
            if (type === "avatar") {
                setAvatarPreview(null)
            } else {
                setBannerPreview(null)
            }
        }
        
        // reset input in case of re-uploading
        e.target.value = ""
    }

    return (
        <div className="profile-page">
            <ProfileHeader 
                bannerSrc={bannerPreview || user?.banner}
                avatarSrc={avatarPreview || user?.avatar}
                name={user?.displayName}
                email={user?.email}
                isEditing={isEditing}
                onEditToggle={() => setIsEditing(prev => !prev)} 
                onAvatarClick={() => avatarRef.current.click()}
                onBannerClick={() => bannerRef.current.click()}
                onRemoveAvatar={null}
                onRemoveBanner={null}
                streak={streak}
            />

            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                ref={avatarRef}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "avatar")}
            />

            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                ref={bannerRef}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "banner")}
            />

            <div className="profile-content">
                <LevelCard title={levelTitle} level={level} progress={progress} />

                <RewardsCard 
                    ready={ready}
                    locked={locked}
                />

                <ChallengesPreview />
            </div>
        </div>
    )
}

export default Profile