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

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    function handleDeleteClick() {
        if (!password) return
        setError("")
        setShowConfirm(true)
    }

    async function handleConfirmDelete() {
        setLoading(true)

        try {
            await deleteAccount(password)
            navigate("/login")
        } catch (err) {
            setError(err.message || "Couldn't verify your password. Please try again.")
            setShowConfirm(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <PageHeader title="Delete Account" />

            <PageIntro 
                title="Ready to say goodbye?"
                text="This action is permanent."
            />

            <Section>
                <p className="secondary-text">
                    Deleting your account will <strong>permanently</strong> remove all your data - including
                    transactions, goals, challenges, rewards, and settings.
                    This cannot be undone.
                </p>
            </Section>

            <Section>
                <Input 
                    label="Confirm Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Section>

            {error && <p className="error-text">{error}</p>}

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
                    confirmLabel="Yes, delete everything"
                    cancelLabel="Keep my account"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setShowConfirm(false)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default DeleteAccount