import { useState, useRef, useEffect } from "react"

import { useUser } from "../store/UserStore"
import { useProfile } from "../store/ProfileStore"
import { useRewards } from "../store/RewardStore"
import { useTasks } from "../store/TaskStore"
import { useToast } from "../store/ToastStore"

import ProfileHeader from "../components/profile/ProfileHeader"
import LevelCard from "../components/profile/LevelCard"
import ChallengesPreview from "../components/challenges/ChallengesPreview"
import RewardsCard from "../components/profile/RewardsCard"
import Button from "../components/ui/Button"

import "../styles/pages/Profile.css"

function Profile() {
    const { user, uploadAvatar, uploadBanner, removeAvatar, removeBanner } = useUser()
    const { stats } = useProfile()
    const { rewards } = useRewards()
    const { tasks } = useTasks()
    const { showToast } = useToast()

    const [isEditing, setIsEditing] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)

    const avatarRef = useRef()
    const bannerRef = useRef()

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
            showToast({ message: `File too large (max ${type === "banner" ? "5" : "2"}MB)`, type: "error" })
            return
        }

        const preview = URL.createObjectURL(file)

        try {
            if (type === "avatar") {
                setAvatarPreview(preview)
                await uploadAvatar(file)
                setAvatarPreview(null)
                showToast({ message: "Avatar updated" })
            } else {
                setBannerPreview(preview)
                await uploadBanner(file)
                setBannerPreview(null)
                showToast({ message: "Banner updated" })
            }
        } catch (err) {
            showToast({ message: "Upload failed", type: "error" })
            console.log(err)

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

    async function handleRemoveAvatar() {
        try {
            await removeAvatar()
            showToast({ message: "Avatar removed" })
        } catch {
            showToast({ message: "Couldn't remove avatar", type: "error" })
        }
    }

    async function handleRemoveBanner() {
        try {
            await removeBanner()
            showToast({ message: "Banner removed" })
        } catch {
            showToast({ message: "Couldn't remove banner", type: "error" })
        }
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
                onRemoveAvatar={handleRemoveAvatar}
                onRemoveBanner={handleRemoveBanner}
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

            <div className="profile-edit-toggle-container">
                <Button className="profile-edit-toggle" onClick={() => setIsEditing(prev => !prev)}>
                    {isEditing ? "Done" : "Edit profile"}
                </Button>
            </div>

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