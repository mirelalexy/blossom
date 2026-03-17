import { createContext, useContext, useState, useEffect } from "react"

const RuleContext = createContext()

export function RuleProvider({ children }) {
    const [rules, setRules] = useState(() => {
        const saved = localStorage.getItem("rules")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("rules", JSON.stringify(rules))
    }, [rules])

    function addRule(rule) {
        setRules(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                ...rule
            }
        ])
    }

    function deleteRule(id) {
        setRules(prev => prev.filter(r => r.id !== id))
    }

    function getRulesByCategory(categoryId) {
        return rules.filter(r => r.categoryId === categoryId)
    }

    return (
        <RuleContext.Provider value={{ rules, addRule, deleteRule, getRulesByCategory }}>
            {children}
        </RuleContext.Provider>
    )
}

export function useRules() {
    return useContext(RuleContext)
}