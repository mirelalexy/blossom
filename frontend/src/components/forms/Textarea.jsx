import "../../styles/components/Textarea.css"

function Textarea({ label, ...props }) {
    return (
        <div className="form-field">
            {label && <label className="input-label">{label}</label>}

            <textarea 
                className="textarea"
                {...props}
            />
        </div>
    )
}

export default Textarea