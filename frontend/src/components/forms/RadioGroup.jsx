function RadioGroup({ label, name, options, value, onChange }) {
    return (
        <div className="form-field">
            {label && <label>{label}</label>}
            {options.map((opt) => {
                <label key={opt.value}>
                    <input type="radio" name={name} value={value} checked={value === opt.value} onChange={onChange}>
                        {opt.label}
                    </input>
                </label>
            })}
        </div>
    )
}

export default RadioGroup