import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const RuleContext = createContext()

export function RuleProvider({ children }) {
    const { user } = useUser()
    const [rules, setRules] = useState([])

    useEffect(() => {
        if (!user) return
        
        async function fetchRules() {        
            try { 
                const res = await apiFetch("/api/rules")
        
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
    }, [user])
    
    async function addRule(rule) {
        try {
            const res = await apiFetch("/api/rules", {
                method: "POST",
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
        try {
            await apiFetch(`/api/rules/${id}`, {
                method: "DELETE"
            })

            setRules(prev => prev.filter(r => r.id !== id))
        } catch (err) {
            console.log("Delete rule failed: ", err)
        }        
    }

    async function updateRule(rule) {
        try {
            const res = await apiFetch(`/api/rules/${rule.id}`, {
                method: "PUT",
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