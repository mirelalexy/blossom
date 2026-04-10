import { createContext, useContext, useState, useEffect } from "react"

const API_URL = import.meta.env.VITE_API_URL

const CategoryContext = createContext()

export function CategoryProvider({ children }) {
    const [categories, setCategories] = useState([])

    useEffect(() => {
            async function fetchCategories() {
                const token = localStorage.getItem("token")
        
                if (!token) return
        
                try { 
                    const res = await fetch(`${API_URL}/api/categories`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
        
                    const data = await res.json()
            
                    setCategories(data)
                } catch (err) {
                    console.log("Fetch categories failed: ", err)
                }
            }
        
            fetchCategories()
        }, [])

    async function addCategory(name, type = "expense") {
        const token = localStorage.getItem("token")
        const trimmed = name.trim()
        if (!trimmed) return

        try {
            const res = await fetch(`${API_URL}/api/categories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: trimmed, type })
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error)
                return
            }

            setCategories(prev => [...prev, data])
        } catch (err) {
            console.log("Add category failed: ", err)
        }
    }

    async function renameCategory(id, newName) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            })

            const data = await res.json()

            setCategories(prev =>
                prev.map(cat =>
                    cat.id === id ? data : cat
                )
            )
        } catch (err) {
            console.log("Rename category failed: ", err)
        }
    }

    async function deleteCategory(id) {
        const token = localStorage.getItem("token")

        try {
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await res.json()

            if (!res.ok) {
                alert(data.error)
                return
            }

            setCategories(prev =>
                prev.filter(cat => cat.id !== id)
            )
        } catch (err) {
            console.log("Delete category failed: ", err)
        }
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