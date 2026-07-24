import Icon from "../ui/Icon"

import { CUSTOM_CATEGORY_KEYS } from "../../utils/appIcons"

import "../../styles/components/IconSelector.css"

function IconSelector({ label = "Icon", value, onChange }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <div className="icon-selector-grid">
                {CUSTOM_CATEGORY_KEYS.map((key) => (
                    <button
                        key={key}
                        type="button"
                        className={`icon-selector-option ${value === key ? "selected" : ""}`}
                        onClick={() => onChange(key)}
                        aria-label={key}
                    >
                        <Icon name={key} size={20} />
                    </button>
                ))}
            </div>
        </div>
    )
}

export default IconSelector