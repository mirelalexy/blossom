import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" 

import { useUser } from "../store/UserStore"

import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function Register() {
    const [displayName, setDisplayName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const { loading } = useUser()

    const navigate = useNavigate()

    // prevent going back to login if already logged in
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [navigate])

    async function handleRegister(e) {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password, displayName })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Register failed")
                return
            }

            navigate("/")
        } catch (err) {
            setError("Something went wrong")
        }
    }

    return (
        <div className="page-content">
            <h2 className="login-title">Create your Blossom account</h2>

            <form onSubmit={handleRegister} className="login-form">
                <Input 
                    label="Display Name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />

                <Input 
                    label="Email"
                    type="email"
                    placeholder="example@blossom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Input 
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </Button>
            </form>

            {error && <p className="error-text">{error}</p>}
        </div>
    )
}

export default Register