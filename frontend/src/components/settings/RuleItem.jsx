import { formatRule } from "../../utils/formatRule"

import Icon from "../ui/Icon"

import "../../styles/components/RuleItem.css"

function RuleItem({ rule, category, onDelete }) {
    return (
        <div className="settings-item settings-item--rule">
            <div className="settings-rule-item-left">
                <p className="settings-item-category-name">{category?.name}</p>
                <p className="settings-item-max-number">{formatRule(rule).number}</p>
                <p className="settings-item-type-rule">{formatRule(rule).type}</p>
            </div>

            <div className="settings-item-right--delete" onClick={() => onDelete(rule.id)}>
                <Icon name="delete" size={18} color={`var(--danger)`} />
            </div>
        </div>
    )
}

export default RuleItem