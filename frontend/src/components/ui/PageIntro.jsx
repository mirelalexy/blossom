import "../../styles/components/PageIntro.css"

function PageIntro({ title, text }) {
    return (
        <div className="page-intro-content">
            <h2 className="page-intro-title">{title}</h2>
            <p className="page-intro-text">{text}</p>
        </div>
    )
}

export default PageIntro