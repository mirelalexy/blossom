import Button from "../ui/Button"
import Icon from "../ui/Icon"

function OnboardingStep({ done, icon, label, cta, hint, onAction }) {
    return (
        <div className={`onboarding-step ${done ? "onboarding-step-done" : ""}`}>
            <div className="onboarding-step-check">
                {done 
                    ? <Icon name="completed" size={16} />
                    : <Icon name={icon} size={16} /> 
                }
            </div>

            <div className="onboarding-step-body">
                <p className="onboarding-step-label">{label}</p>
                {!done && <p className="onboarding-step-hint">{hint}</p>}
            </div>
            {!done && (
                <Button className="onboarding-step-cta" onClick={onAction}>
                    {cta}
                </Button>
            )}
        </div>
    )
}

export default OnboardingStep