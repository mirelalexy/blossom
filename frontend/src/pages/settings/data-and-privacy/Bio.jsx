import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsToggle from "../../../components/settings/SettingsToggle"
import Textarea from "../../../components/forms/Textarea"
import Button from "../../../components/ui/Button"

import "../../../styles/pages/Bio.css"

const MAX_BIO_LENGTH = 500

function Bio() {
    const { user, updateUser } = useUser()
    const [bio, setBio] = useState(user.bio || "")

    const hasChanges = bio !== (user.bio || "")

    function handleToggle(val) {
        updateUser("shareBio", val)
    }

    function handleSave() {
        updateUser("bio", bio)
    }

    return (
        <div className="page">
            <PageHeader title="Your Bio" />

            <Section>
                <SettingsCard>
                    <SettingsToggle 
                        label="Use my bio when we talk"
                        checked={user.shareBio}
                        onChange={handleToggle}
                    />
                </SettingsCard>
            </Section>

            <p className="bio-explainer">
                Tell me a little about yourself beyond your transactions. I'll keep what you
                share in mind when we talk. Turning this off stops me from using your bio. 
                You can turn it back on anytime, or delete your bio if you no longer want to 
                keep it.
            </p>

            {user.shareBio && (
                <div className="bio-area">
                    <Textarea 
                        label="Your bio"
                        value={bio}
                        maxLength={MAX_BIO_LENGTH}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="What should I know about you beyond your transactions?"
                    />

                    <p className="bio-char-count">{bio.length}/{MAX_BIO_LENGTH}</p>

                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges}
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Bio