import { formatRule } from "../../utils/formatRule"

import Icon from "../ui/Icon"

function RuleItem({ rule, category, onDelete }) {
    return (
        <div className="settings-item">
            <div className="settings-item-left">
                <span className="settings-item-label">{category?.name}</span>

                <p>{formatRule(rule)}</p>
            </div>

            <div className="settings-item-right" onClick={() => onDelete(rule.id)}>
                <Icon name="delete" size={18} />
            </div>
        </div>
    )
}

export default RuleItem