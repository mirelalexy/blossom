import { useState, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"

import { useRules } from "../../../store/RuleStore"
import { useCategories } from "../../../store/CategoryStore"

import { filterRules } from "../../../utils/filterRules"
import { formatCategoryLabel, formatRuleTypeLabel } from "../../../utils/filterPillUtils"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import RuleItem from "../../../components/settings/RuleItem"
import ConfirmModal from "../../../components/ui/ConfirmModal"
import FilterPill from "../../../components/filters/FilterPill"
import FilterPillMenu from "../../../components/filters/FilterPillMenu"
import Select from "../../../components/forms/Select"
import RadioGroup from "../../../components/forms/RadioGroup"

function CustomSpendingRules() {
    const navigate = useNavigate()

    const { rules, deleteRule } = useRules()
    const { categories, getCategoryById } = useCategories()

    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    const [filters, setFilters] = useState({ category: "", type: "" })
    const [openFilterId, setOpenFilterId] = useState(null)

    const categoryPillRef = useRef(null)
    const typePillRef = useRef(null)

    function updateFilter(field, value) {
        setFilters(prev => ({
            ...prev, 
            [field]: value
        }))
    }

    function clearFilter(field) {
        updateFilter(field, "")
    }

    const hasActiveFilters = filters.category || filters.type

    // select only from categories that have rules
    const ruleCategoryOptions = useMemo(() => {
        const usedIds = [...new Set(rules.map(r => r.category_id))]

        return [
            { value: "", label: "All categories" },
            ...usedIds
                .map(id => getCategoryById(id))
                .filter(Boolean)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(c => ({ value: c.id, label: c.name }))
        ]
    }, [rules, categories])

    const visibleRules = filterRules(rules, filters)

    function handleDeleteConfirm() {
        deleteRule(pendingDeleteId)
        setPendingDeleteId(null)
    }

    return (
        <div className="page">
            <PageHeader title="Custom Spending Rules" />

            {rules.length > 0 && (
                <div className="filter-pill-row">
                    <FilterPill
                        pillRef={categoryPillRef}
                        label="Category"
                        value={formatCategoryLabel(filters.category, categories)}
                        onClick={() => setOpenFilterId("category")}
                        onClear={() => clearFilter("category")}
                    />
            
                    <FilterPill
                        pillRef={typePillRef}
                        label="Rule Type"
                        value={formatRuleTypeLabel(filters.type)}
                        onClick={() => setOpenFilterId("type")}
                        onClear={() => clearFilter("type")}
                    />
            
                    {hasActiveFilters && (
                        <button
                            className="filter-pill-clear-all"
                            onClick={() => {
                                clearFilter("category")
                                clearFilter("type")
                            }}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}
            
            <FilterPillMenu
                isOpen={openFilterId === "category"}
                onClose={() => setOpenFilterId(null)}
                anchorRef={categoryPillRef}
                title="Category"
            >
                <Select
                    label="Category"
                    value={filters.category}
                    onChange={(e) => updateFilter("category", e.target.value)}
                    options={ruleCategoryOptions}
                />
            </FilterPillMenu>
            
            <FilterPillMenu
                isOpen={openFilterId === "type"}
                onClose={() => setOpenFilterId(null)}
                anchorRef={typePillRef}
                title="Rule Type"
            >
                <RadioGroup
                    label="Rule Type"
                    value={filters.type}
                    onChange={(val) => updateFilter("type", val)}
                    options={[
                        { value: "", label: "All" },
                        { value: "single_limit", label: "Single Transaction Limit" },
                        { value: "weekly_count", label: "Weekly Transaction Limit" }
                    ]}
                />
            </FilterPillMenu>
            
            <Section title="Spending Guidelines">
                <SettingsCard>
                    {hasActiveFilters && visibleRules.length === 0 ? (
                        <p className="secondary-text">No rules match these filters.</p>
                    ) : (
                        visibleRules.map(rule => {
                            const category = getCategoryById(rule.category_id)

                            if (!category) return null

                            return (
                                <RuleItem 
                                    key={rule.id}
                                    rule={rule}
                                    category={category}
                                    onDelete={(id) => setPendingDeleteId(id)}
                                />
                            )
                        })
                    )}

                    <SettingsItem 
                        label="Add Spending Rule"
                        onClick={() => navigate("/settings/rules/add")}
                    />
                </SettingsCard>
            </Section>

            {pendingDeleteId && (
                <ConfirmModal
                    title="Remove this rule?"
                    message="The spending limit for this category will be removed. You can always add it back."
                    confirmLabel="Remove Rule"
                    cancelLabel="Keep It"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setPendingDeleteId(null)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default CustomSpendingRules