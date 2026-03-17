import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Input from "../../../components/forms/Input"
import Button from "../../../components/ui/Button"

function EditCategory() {
    const navigate = useNavigate()
    const { id } = useParams()

    const { categories, getCategoryById, renameCategory } = useCategories() 

    const category = getCategoryById(id)

    const [name, setName] = useState(category?.name || "")

    if (!category) {
        return <p>Category not found.</p>
    }

    function handleSave() {
        const trimmed = name.trim()

        if (!trimmed) {
            alert("Category name cannot be empty.")
            return
        }

        const exists = categories.some(
            c =>
                c.name.toLowerCase() === trimmed.toLowerCase() &&
                c.type === category.type &
                c.id !== category.id
        )

        if (exists) {
            alert("Category already exists.")
            return
        }

        renameCategory(category.id, trimmed)
        navigate(-1)
    }

    return (
        <div className="settings-content">
            <PageHeader title="Edit Category" />

            <Input 
                label="Category Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <Button 
                onClick={handleSave}
            >
                Save
            </Button>
        </div>
    )
}

export default EditCategory