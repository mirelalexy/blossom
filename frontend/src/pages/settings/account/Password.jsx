import { useNavigate } from "react-router-dom"
import { useState } from "react"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import PageIntro from "../../../components/ui/PageIntro"
import Section from "../../../components/ui/Section"

function Password() {
    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    function handleSave() {
        if (!currentPassword || !newPassword) return
        if (newPassword.length < 6) return

        navigate(-1)
    }

    return (
        <div className="settings-content">
            <PageHeader title="Password" />

            <PageIntro 
                title="Update your password"
                text="Please enter your current password and your new password."
            />

            <Section>
                <Input 
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                />

                <Input 
                    label="New Password"
                    type="password"
                    value={newPassword}
                    minLength={6}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
            </Section>

            <Button 
                onClick={handleSave}
            >
                Change Password
            </Button>
        </div>
    )
}

export default Password