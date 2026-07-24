import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "./UserStore"
import { apiFetch } from "../utils/apiFetch"

const CategoryContext = createContext()

export function CategoryProvider({ children }) {
    const { user } = useUser()
    const [categories, setCategories] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        if (!user) return
        
        async function fetchCategories() {      
            try { 
                const res = await apiFetch("/api/categories")
        
                const data = await res.json()
            
                setCategories(data)
            } catch (err) {
                console.error("Fetch categories failed: ", err)
            }
        }
        
        fetchCategories()
    }, [user])

    async function addCategory(name, type = "expense", icon = "circle") {
        const trimmed = name.trim()
        if (!trimmed) return

        try {
            const res = await apiFetch("/api/categories", {
                method: "POST",
                body: JSON.stringify({ name: trimmed, type, icon })
            })

            const data = await res.json()

            if (!res.ok) {
                setError("Error: ", data.error)
                return null
            }

            setCategories(prev => [...prev, data])
            return data
        } catch (err) {
            console.error("Add category failed: ", err)
            return null
        }
    }

    async function updateCategory(id, { name, icon } = {}) {
        try {
            const res = await apiFetch(`/api/categories/${id}`, {
                method: "PUT",
                body: JSON.stringify({ name, icon })
            })

            const data = await res.json()

            setCategories(prev =>
                prev.map(cat =>
                    cat.id === id ? data : cat
                )
            )

            return data
        } catch (err) {
            console.error("Update category failed: ", err)
        }
    }

    async function deleteCategory(id) {
        try {
            const res = await apiFetch(`/api/categories/${id}`, {
                method: "DELETE"
            })

            const data = await res.json()

            if (!res.ok) {
                setError("Error: ", data.error)
                return
            }

            setCategories(prev =>
                prev.filter(cat => cat.id !== id)
            )
        } catch (err) {
            console.error("Delete category failed: ", err)
        }
    }

    function getCategoriesByType(type) {
        return categories.filter(c => c.type === type)
    }

    function getCategoryById(id) {
        return categories.find(c => c.id === id)
    }

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, getCategoriesByType, getCategoryById }}>
            {children}
        </CategoryContext.Provider>
    )
}

export function useCategories() {
    return useContext(CategoryContext)
}