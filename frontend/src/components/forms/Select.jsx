import Icon from "../ui/Icon"

import "../../styles/components/Select.css"

function Select({ label, options, ...props }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <div className="select-wrapper">
                <select {...props}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
                </select>

                <Icon name="select" className="select-arrow" />
            </div>
        </div>
    )
}

export default Select