import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"

function Email() {
    const navigate = useNavigate()
    const { user, updateUser } = useUser()
    const [email, setEmail] = useState(user.email)

    function handleSave(e) {
        e.preventDefault()

        updateUser("email", email.trim().toLowerCase())
        navigate(-1)
    }

    return (
        <div className="page">
            <PageHeader title="Email" />

            <form onSubmit={handleSave} className="form">
                <Input 
                    label="Email"
                    type="email"
                    value={email}
                    maxLength={30}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button 
                    type="submit"
                    disabled={!email.trim() || email === user.email}
                >
                    Save
                </Button>
            </form>
        </div>
    )
}

export default Email