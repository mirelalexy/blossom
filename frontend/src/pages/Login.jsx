import { useState } from "react"
import { useNavigate } from "react-router-dom" 
import Input from "../components/forms/Input"
import Button from "../components/ui/Button"

import "../styles/pages/Login.css"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        setError("")

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
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
        <div className="page-content login-content">
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