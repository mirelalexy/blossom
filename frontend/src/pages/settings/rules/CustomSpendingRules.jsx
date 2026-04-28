import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useRules } from "../../../store/RuleStore"
import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import RuleItem from "../../../components/settings/RuleItem"
import ConfirmModal from "../../../components/ui/ConfirmModal"

function CustomSpendingRules() {
    const navigate = useNavigate()

    const { rules, deleteRule } = useRules()
    const { getCategoryById } = useCategories()

    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    function handleDeleteConfirm() {
        deleteRule(pendingDeleteId)
        setPendingDeleteId(null)
    }

    return (
        <div className="page">
            <PageHeader title="Custom Spending Rules" />

            <Section title="Spending Guidelines">
                <SettingsCard>
                    {rules.length !== 0 && (
                        rules.map(rule => {
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
                    confirmLabel="Remove"
                    cancelLabel="Keep it"
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setPendingDeleteId(null)}
                    variant="warning"
                />
            )}
        </div>
    )
}

export default CustomSpendingRules