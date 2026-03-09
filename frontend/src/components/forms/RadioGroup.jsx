function RadioGroup({ label, name, options = [], value, onChange }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <div className="radio-group">
                {options.map((opt) => (
                    <label key={opt.value} className="radio-option">
                        <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} />
                        <span className="radio-label">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    )
}

export default RadioGroup