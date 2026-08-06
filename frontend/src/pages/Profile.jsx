import { useState, useRef, useEffect } from "react"

import { useUser } from "../store/UserStore"
import { useProfile } from "../store/ProfileStore"
import { useRewards } from "../store/RewardStore"
import { useTasks } from "../store/TaskStore"
import { useToast } from "../store/ToastStore"

import { formatDate, isAccountAnniversary, getYearsSince } from "../utils/dateUtils"

import ProfileHeader from "../components/profile/ProfileHeader"
import LevelCard from "../components/profile/LevelCard"
import ChallengesPreview from "../components/challenges/ChallengesPreview"
import RewardsCard from "../components/profile/RewardsCard"
import Button from "../components/ui/Button"

import "../styles/pages/Profile.css"

const AVATAR_MAX_SIZE = 2 * 1024 * 1024
const BANNER_MAX_SIZE = 5 * 1024 * 1024

function Profile() {
    const { user, uploadAvatar, uploadBanner, removeAvatar, removeBanner, updateBannerPosition } = useUser()
    const { stats } = useProfile()
    const { rewards } = useRewards()
    const { tasks } = useTasks()
    const { showToast } = useToast()

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState("")

    // unsaved changes until user saves everything
    const [avatarFile, setAvatarFile] = useState(null)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [avatarRemoved, setAvatarRemoved] = useState(null)

    const [bannerFile, setBannerFile] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)
    const [bannerRemoved, setBannerRemoved] = useState(null)
    const [draftPositionY, setDraftPositionY] = useState(user?.bannerPositionY ?? 50)

    const avatarRef = useRef()
    const bannerRef = useRef()

    const anniversary = isAccountAnniversary(user.createdAt)
    const years = getYearsSince(user.createdAt)

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

    function resetDraftState() {
        setAvatarFile(null)
        setAvatarPreview(null)
        setAvatarRemoved(false)

        setBannerFile(null)
        setBannerPreview(null)
        setAvatarRemoved(null)
        setDraftPositionY(user?.bannerPositionY ?? 50)

        setSaveError("")
    }

    function handleEnterEditMode() {
        setDraftPositionY(user?.bannerPositionY ?? 50)
        setIsEditing(true)
    }

    function handleAvatarFileSelected(file) {
        if (!file) return
        
        if (file.size > AVATAR_MAX_SIZE) {
            showToast({ message: "File too large (max 2MB)", type: "error" })
        }

        // clean up from previous file
        if (avatarPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview)
        }

        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
        setAvatarRemoved(false)
    }

    function handleBannerFileSelected(file) {
        if (!file) return
        
        if (file.size > BANNER_MAX_SIZE) {
            showToast({ message: "File too large (max 5MB)", type: "error" })
        }

        // clean up from previous file
        if (bannerPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(bannerPreview)
        }

        setBannerFile(file)
        setBannerPreview(URL.createObjectURL(file))
        setBannerRemoved(false)
        setDraftPositionY(50) // always center new banner file
    }

    function handleAvatarRemove() {
        if (avatarPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(avatarPreview)
        }

        setAvatarFile(null)
        setAvatarPreview(null)
        setAvatarRemoved(true)
    }

    function handleBannerRemove() {
        if (bannerPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(bannerPreview)
        }

        setBannerFile(null)
        setBannerPreview(null)
        setBannerRemoved(true)
        setDraftPositionY(50)
    }

    async function handleDone() {
        setIsSaving(true)
        setSaveError("")

        try {
            if (avatarFile) {
                await uploadAvatar(avatarFile)
            } else if (avatarRemoved) {
                await removeAvatar()
            }

            if (bannerFile) {
                await uploadBanner(bannerFile)
            } else if (bannerRemoved) {
                await removeBanner()
            } else if (draftPositionY !== (user?.bannerPositionY ?? 50)) {
                await updateBannerPosition(draftPositionY)
            }

            resetDraftState()
            setIsEditing(false)
            showToast({ message: "Profile updated" })
        } catch (err) {
            console.error("Failed to save profile changes: ", err)
            setSaveError("Couldn't save your changes. Please try again.")
        } finally {
            setIsSaving(false)
        }
    }

    function handleCancel() {
        resetDraftState()
        setIsEditing(false)
    }

    const displayAvatarSrc = avatarFile
        ? avatarPreview
        : avatarRemoved
            ? null
            : user?.avatar

    const displayBannerSrc = bannerFile
        ? bannerPreview
        : bannerRemoved
            ? null
            : user?.banner

    return (
        <div className="profile-page">
            <ProfileHeader 
                bannerSrc={displayBannerSrc}
                bannerPositionY={draftPositionY}
                onBannerPositionDrag={setDraftPositionY}
                avatarSrc={displayAvatarSrc}
                name={user?.displayName}
                email={user?.email}
                isEditing={isEditing}
                onAvatarClick={() => avatarRef.current.click()}
                onBannerClick={() => bannerRef.current.click()}
                onRemoveAvatar={handleAvatarRemove}
                onRemoveBanner={handleBannerRemove}
                streak={streak}
            />

            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                ref={avatarRef}
                style={{ display: "none" }}
                onChange={(e) => {
                    handleAvatarFileSelected(e.target.files[0])
                    e.target.value = ""
                }}
            />

            <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/gif"
                ref={bannerRef}
                style={{ display: "none" }}
                onChange={(e) => {
                    handleBannerFileSelected(e.target.files[0])
                    e.target.value = ""
                }}
            />

            {anniversary ? (
                <p className="account-anniversary-info">
                    Happy anniversary! We've been blooming together for {years} {years === 1 ? "year" : "years"}.
                </p>
            ) : (
                <p className="blooming-together-info">
                    Blooming together since {formatDate(user.createdAt)}
                </p>
            )}

            <div className="profile-edit-toggle-container">
                {isEditing ? (
                    <div className="profile-edit-actions">
                        <Button
                            onClick={handleDone}
                            disabled={isSaving}
                        >
                            {isSaving? "Saving..." : "Done"}
                        </Button>

                        <Button
                            className="neutral"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <Button onClick={handleEnterEditMode}>
                        Edit Profile
                    </Button>
                )}

                {saveError && <p className="error-text">{saveError}</p>}
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