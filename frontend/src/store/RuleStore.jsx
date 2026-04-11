import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const RuleContext = createContext()

export function RuleProvider({ children }) {
    const [rules, setRules] = useState([])

    useEffect(() => {
        async function fetchRules() {
            const token = localStorage.getItem("token")
        
            if (!token) return
        
            try { 
                const res = await fetch(`${API_URL}/api/rules`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
        
                const data = await res.json()
                setRules(
                    data.map(r => ({
                        ...r,
                        value: Number(r.value)
                    }))
                )
            } catch (err) {
                console.log("Fetch rules failed: ", err)
            }
        }
        
        fetchRules()
    }, [])
    
    async function addRule(rule) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/rules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(rule)
            })

            const data = await res.json()
            setRules(prev => [...prev, { 
                ...data,
                value: Number(data.value)
            }])
        } catch (err) {
            console.log("Add rule failed: ", err)
        }
    }

    async function deleteRule(id) {
        const token = localStorage.getItem("token")

        try {
            await fetch(`${API_URL}/api/rules/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            setRules(prev => prev.filter(r => r.id !== id))
        } catch (err) {
            console.log("Delete rule failed: ", err)
        }        
    }

    async function updateRule(rule) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/rules/${rule.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(rule)
            })

            const data = await res.json()

            setRules(prev => 
                prev.map(r =>
                    r.id === data.id 
                        ? { ...data, value: Number(data.value) }
                        : r
                )
            )
        } catch (err) {
            console.log("Update rule failed: ", err)
        }
    }

    function getRulesByCategory(categoryId) {
        return rules.filter(r => r.category_id === categoryId)
    }

    return (
        <RuleContext.Provider value={{ rules, addRule, deleteRule, updateRule, getRulesByCategory }}>
            {children}
        </RuleContext.Provider>
    )
}

export function useRules() {
    return useContext(RuleContext)
}