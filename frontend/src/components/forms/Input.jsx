function Input({ label, ...props }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}
            <input {...props} />
        </div>
    )
}

export default Input