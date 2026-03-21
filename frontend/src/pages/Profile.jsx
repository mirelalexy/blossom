import { useState, useRef } from "react"

import { useUser } from "../store/UserStore"
import { calculateStreak } from "../utils/streakUtils"
import { useTransactions } from "../store/TransactionStore"
import { calculateXP, getLevelFromXP, getLevelProgress, getLevelTitle } from "../utils/levelUtils"
import { useChallenges } from "../store/ChallengeStore"

import ProfileHeader from "../components/profile/ProfileHeader"
import LevelCard from "../components/profile/LevelCard"

import "../styles/pages/Profile.css"
import ChallengesPreview from "../components/challenges/ChallengesPreview"

function Profile() {
    const { transactions } = useTransactions()
    const { user, updateUser } = useUser()
    const [isEditing, setIsEditing] = useState(false)
    
    const { challenges } = useChallenges()
    const completedChallenges = challenges.filter(c => c.completed).length

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

    const streak = calculateStreak(transactions)

    const xp = calculateXP({
        transactions,
        streak,
        goalsCompleted: 0,
        weeklyLimitsHit: 0,
        completedChallenges
    })

    const level = getLevelFromXP(xp)
    const levelTitle = getLevelTitle(level)
    const progress = getLevelProgress(xp)

    return (
        <div className="profile-page">
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
                streak={streak}
            />

            <input
                type="file"
                accept="image/*"
                ref={avatarRef}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "avatar")}
            />

            <input
                type="file"
                accept="image/*"
                ref={bannerRef}
                style={{ display: "none" }}
                onChange={(e) => handleUpload(e, "banner")}
            />

            <div className="profile-content">
                <LevelCard title={levelTitle} level={level} progress={progress} />

                <ChallengesPreview />
            </div>
        </div>
    )
}

export default Profile