import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"
import PageIntro from "../../../components/ui/PageIntro"
import Section from "../../../components/ui/Section"
import ConfirmModal from "../../../components/ui/ConfirmModal"

function DeleteAccount() {
    const navigate = useNavigate()

    const { deleteAccount } = useUser()
    const [password, setPassword] = useState("")
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)

    function handleDeleteClick() {
        if (!password) return
        setShowConfirm(true)
    }

    async function handleConfirmDelete() {
        setLoading(true)

        try {
            await deleteAccount(password)
            navigate("/login")
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
            setShowConfirm(false)
        }
    }

    return (
        <div className="settings-content">
            <PageHeader title="Delete Account" />

            <PageIntro 
                title="Ready to say goodbye?"
                text="If you no longer wish to use Blossom, you can delete your account here."
            />

            <Section>
                <Input 
                    label="Confirm Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Section>

            <Button 
                onClick={handleDeleteClick}
                disabled={!password || loading}
            >
                Delete Account
            </Button>

            {showConfirm && (
                <ConfirmModal
                    title="Delete account?"
                    message={`This action cannot be undone.\nAll your data will be permanently deleted.`}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default DeleteAccount