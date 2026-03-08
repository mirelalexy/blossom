function Select({ label, options, ...props }) {
    return (
        <div className="form-field">
            {label && <label>{label}</label>}
            <select {...props}>
                {options.map((opt) => {
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                })}
            </select>
        </div>
    )
}

export default Select