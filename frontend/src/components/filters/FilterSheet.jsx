import { useEffect, useRef, useState } from "react"

import { useCategories } from "../../store/CategoryStore"

import Select from "../forms/Select"
import RadioGroup from "../forms/RadioGroup"
import Button from "../ui/Button"
import Input from "../forms/Input"

import "../../styles/components/FilterSheet.css"

function FilterSheet({ filters, updateFilter, onClose }) {
    const { categories } = useCategories()

    // drag to dismiss state
    const sheetRef = useRef(null)
    const startYRef = useRef(null)
    const currentYRef = useRef(0)
    const [dragging, setDragging] = useState(false)
    const [translateY, setTranslateY] = useState(0)
    const [closing, setClosing] = useState(false)

    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        return () => {
            document.body.style.overflow = prev
        }
    }, [])

    function triggerClose() {
        setClosing(true)
        setTimeout(onClose, 280)
    }

    // touch drag
    function onTouchStart(e) {
        startYRef.current  = e.touches[0].clientY
        currentYRef.current = 0
        setDragging(true)
    }

    function onTouchMove(e) {
        const delta = e.touches[0].clientY - startYRef.current
        if (delta < 0) return // don't allow dragging up

        currentYRef.current = delta
        setTranslateY(delta)
    }

    function onTouchEnd() {
        setDragging(false)

        // if dragged more than 100px down, dismiss
        if (currentYRef.current > 100) {
            triggerClose()
        } else {
            setTranslateY(0)
        }
    }

    function handleClear() {
        updateFilter("category", "")
        updateFilter("type", "")
        updateFilter("intent", "")
        updateFilter("mood", "")
        updateFilter("period", { start: "", end: "" })
    }

    const categoryOptions = [
        { value: "", label: "All categories" },
        ...categories
            .filter(c => !c.id.includes("other"))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({
                value: c.id,
                label: c.name
            })),
        // make Other last option
        ...categories
            .filter(c => c.id.includes("other"))
            .map(c => ({
                value: c.id,
                label: c.name
            })),
    ]

    return (
        <>
            <div
                className={`filter-overlay ${closing ? "filter-overlay--out" : ""}`}
                onClick={triggerClose}
            />

            <div
                ref={sheetRef}
                className={`filter-sheet ${closing ? "filter-sheet--out" : ""}`}
                style={{
                    transform: `translateY(${translateY}px)`,
                    transition: dragging ? "none" : undefined
                }}
            >
                <div
                    className="filter-handle-area"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className="filter-handle" />
                </div>

                <div className="filter-sheet-inner">
                    <div className="filter-sheet-header">
                        <h2>Filters</h2>
                        <button className="filter-close-btn" onClick={triggerClose}>
                            ✕
                        </button>
                    </div>

                    <Select 
                        label="Category"
                        value={filters.category}
                        onChange={(e) => updateFilter("category", e.target.value)}
                        options={categoryOptions}
                    />

                    <RadioGroup 
                        label="Type"
                        value={filters.type}
                        onChange={(val) => updateFilter("type", val)}
                        options={[
                            { value: "", label: "All" },
                            { value: "expense", label: "Expense" },
                            { value: "income", label: "Income" }
                        ]}
                    />

                    {filters.type !== "income" && (
                        <RadioGroup 
                            label="Intent"
                            value={filters.intent}
                            onChange={(val) => updateFilter("intent", val)}
                            options={[
                                { value: "", label: "All" },
                                { value: "necessary", label: "Necessary" },
                                { value: "planned", label: "Planned" },
                                { value: "impulse", label: "Impulse" }
                            ]}
                        />
                    )}
                    
                    <Select 
                        label="Mood"
                        value={filters.mood}
                        onChange={(e) => updateFilter("mood", e.target.value)}
                        options={[
                            { value: "", label: "Any mood" },
                            { value: "happy", label: "Happy" },
                            { value: "calm", label: "Calm" },
                            { value: "neutral", label: "Neutral" },
                            { value: "anxious", label: "Anxious" },
                            { value: "sad", label: "Sad" }
                        ]}
                    />

                    <Input 
                        label="From"
                        type="date"
                        value={filters.period.start}
                        onChange={(e) => updateFilter("period", {
                            ...filters.period,
                            start: e.target.value
                        })}
                    />

                    <Input 
                        label="To"
                        type="date"
                        value={filters.period.end}
                        onChange={(e) => updateFilter("period", {
                            ...filters.period,
                            end: e.target.value
                        })}
                    />

                    <div className="filter-actions">
                        <Button onClick={onClose}>Apply</Button>
                        <Button className="secondary" onClick={handleClear}>Clear</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilterSheet