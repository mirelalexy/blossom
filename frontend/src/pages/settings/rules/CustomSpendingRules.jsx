import { useNavigate } from "react-router-dom"

import { useRules } from "../../../store/RuleStore"
import { useCategories } from "../../../store/CategoryStore"

import PageHeader from "../../../components/ui/PageHeader"
import Section from "../../../components/ui/Section"
import SettingsCard from "../../../components/settings/SettingsCard"
import SettingsItem from "../../../components/settings/SettingsItem"
import RuleItem from "../../../components/settings/RuleItem"

function CustomSpendingRules() {
    const navigate = useNavigate()

    const { rules, deleteRule } = useRules()
    const { getCategoryById } = useCategories()

    return (
        <div className="settings-content">
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
                                    onDelete={(id) => {
                                        const confirmed = window.confirm("Delete this rule?")
                                        if (confirmed) deleteRule(id)
                                    }}
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
        </div>
    )
}

export default CustomSpendingRules