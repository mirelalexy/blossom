import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" 
import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

const API_URL = import.meta.env.VITE_API_URL

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    // prevent going back to login if already logged in
    useEffect(() => {
        if (localStorage.getItem("token")) {
            navigate("/")
        }
    }, [])

    async function handleLogin(e) {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Login failed")
                return
            }

            // save token
            localStorage.setItem("token", data.token)

            navigate("/")
        } catch (err) {
            setError("Something went wrong")
        }
    }

    return (
        <div className="page-content">
            <h2 className="login-title">Login to Blossom</h2>

            <form onSubmit={handleLogin} className="login-form">
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

                <Button type="submit">Login</Button>
            </form>

            {error && <p className="error-text">{error}</p>}
        </div>
    )
}

export default Login