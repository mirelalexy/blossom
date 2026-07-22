import { useState } from "react"

import Icon from "../ui/Icon"

function Input({ label, type, ...props }) {
    const [visible, setVisible] = useState(false)

    if (type !== "password") {
        return (
            <div className="form-field">
                {label && <label className="input-label">{label}</label>}
                <input type={type} {...props} />
            </div>
        )
    }

    // toggle visibility for passwords
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <div className="password-wrapper">
                <input type={visible ? "text" : "password"} {...props} />

                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    tabIndex={-1}
                >
                    <Icon name={visible ? "visible" : "hidden"} size={19} className="password-toggle-icon" />
                </button>
            </div>
        </div>
    )
}

export default Input