import { createContext, useContext, useState, useEffect } from "react"

import { getCategoryIcon } from "../utils/getCategoryIcon"

const CategoryContext = createContext()

const defaultCategories = [
    // expense
    { id: "food", name: "Food", icon: "apple", type: "expense", default: true },
    { id: "transport", name: "Transport", icon: "car", type: "expense", default: true },
    { id: "health", name: "Health", icon: "heartPulse", type: "expense", default: true },
    { id: "shopping", name: "Shopping", icon: "handbag", type: "expense", default: true },
    { id: "bills", name: "Bills", icon: "coins", type: "expense", default: true },
    { id: "entertainment", name: "Entertainment", icon: "clapperboard", type: "expense", default: true },
    { id: "other-expense", name: "Other Expenses", icon: "circle", type: "expense", default: true },

    // income
    { id: "salary", name: "Salary", icon: "banknote", type: "income", default: true },
    { id: "freelance", name: "Freelance", icon: "banknote", type: "income", default: true },
    { id: "gift", name: "Gift", icon: "banknote", type: "income", default: true },
    { id: "business", name: "Business", icon: "banknote", type: "income", default: true },
    { id: "refund", name: "Refund", icon: "banknote", type: "income", default: true },
    { id: "other-income", name: "Other Income", icon: "circle", type: "income", default: true }
]

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem("categories")

        return saved ? JSON.parse(saved) : defaultCategories
    })

    useEffect(() => {
        localStorage.setItem("categories", JSON.stringify(categories))
    }, [categories])

    function addCategory(name, type="expense") {
        const trimmed = name.trim()
        if (!trimmed) return

        const exists = categories.some(
            c => c.name.toLowerCase() === trimmed.toLowerCase() && c.type === type
        )

        if (exists) {
            alert("Category already exists.")
            return
        }

        const id = trimmed.toLowerCase().replace(/\s+/g, "-")
        const icon = getCategoryIcon(trimmed)

        setCategories(prev => [
            ...prev,
            {
                id,
                name: trimmed,
                icon,
                type,
                default: false
            }
        ])
    }

    function renameCategory(id, newName) {
        setCategories(prev =>
            prev.map(cat =>
                cat.id === id ? { ...cat, name: newName } : cat
            )
        )
    }

    // delete custom categories
    function deleteCategory(id) {
        setCategories(prev =>
            prev.filter(cat => cat.id !== id || cat.default)
        )
    }

    function getCategoriesByType(type) {
        return categories.filter(c => c.type === type)
    }

    function getCategoryById(id) {
        return categories.find(c => c.id === id)
    }

    return (
        <CategoryContext.Provider value={{ categories, addCategory, renameCategory, deleteCategory, getCategoriesByType, getCategoryById }}>
            {children}
        </CategoryContext.Provider>
    )
}

export function useCategories() {
    return useContext(CategoryContext)
}