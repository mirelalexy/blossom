import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { useUser } from "../../../store/UserStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"

function DisplayName() {
    const navigate = useNavigate()
    const { user, updateUser } = useUser()
    const [name, setName] = useState(user.displayName)

    function handleSave() {
        if (!name.trim() || name === user.displayName) return
        updateUser("displayName", name)
        navigate(-1)
    }

    return (
        <div className="page">
            <PageHeader title="Display Name" />

            <Input 
                label="Display Name"
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => setName(e.target.value)}
            />

            <Button 
                onClick={handleSave}
                disabled={!name.trim() || name === user.displayName}
            >
                Save
            </Button>
        </div>
    )
}

export default DisplayName