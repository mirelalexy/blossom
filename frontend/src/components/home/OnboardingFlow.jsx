import { useNavigate } from "react-router-dom"

import LevelCard from "../profile/LevelCard"
import Button from "../ui/Button"
import Card from "../ui/Card"
import Icon from "../ui/Icon"
import Section from "../ui/Section"
import OnboardingStep from "./OnboardingStep"
import FeatureCard from "./FeatureCard"

import "../../styles/components/OnboardingFlow.css"

const FEATURE_CARDS = [
    {
        icon: "transactions",
        title: "Log with intention",
        body: "Every transaction you log tells me something about you. I track not just what you spend, but how you felt and why, so the picture I build of your habits is actually true."
    },
    {
        icon: "goals",
        title: "Save for what matters",
        body: "Set a primary goal and I'll keep it visible. Your leftover monthly budget can flow into it automatically. Your choice."
    },
    {
        icon: "profile",
        title: "Earn your way up",
        body: "Every transaction earns you 5 XP. Streaks, challenges, and completed goals add more. As you grow, so does your title - from Mindful Seed all the way to Eternal Bloom."
    },
    {
        icon: "heart",
        title: "Your Journey page",
        body: "Once you've logged a few things, I'll start drawing patterns. Mood vs spending. Impulse vs planned. Your best and hardest moments. It all lives in Journey."
    },
    {
        icon: "gem",
        title: "Reward yourself honestly",
        body: "Set a task. Complete it. Then claim a reward - guilt-free, because you earned it. Rewards with an amount that get claimed log automatically as expenses so nothing disappears."
    },
]

function OnboardingFlow({ steps, stepsCompleted, level, levelTitle, levelProgress, onNavigate }) {
    const navigate = useNavigate()

    return (
        <div className="onboarding">
            {/* STEP PROGRESS */}
            <div className="onboarding-progress">
                <p className="onboarding-progress-label">
                    {stepsCompleted === 0
                        ? "Let's set things up together."
                        : stepsCompleted === 1
                        ? "Good start. Two more things and you're ready."
                        : stepsCompleted === 2
                        ? "Almost there - one more step."
                        : "You're all set. This is where it begins."
                    }
                </p>

                <div className="onboarding-steps">
                    <OnboardingStep 
                        done={steps.hasTransaction}
                        icon="transactions"
                        label="Log your first transaction"
                        cta="I'm ready"
                        hint="This is the most important thing I can learn from you."
                        onAction={() => navigate("/add-transaction")}
                    />

                    <OnboardingStep 
                        done={steps.hasGoal}
                        icon="piggyBank"
                        label="Set a saving goal"
                        cta="Let's go"
                        hint="What are you working toward? Even a small goal changes how you see money."
                        onAction={() => navigate("/goals/add")}
                    />

                    <OnboardingStep 
                        done={steps.hasBudget}
                        icon="monthlyBudget"
                        label="Set a monthly budget"
                        cta="Do it now"
                        hint="I'll use this to warn you gently, not shame you."
                        onAction={() => navigate("/settings/budget")}
                    />
                </div>
            </div>

            {/* LEVEL AND XP HINTS */}
            <Section title="Your Stage">
                <LevelCard 
                    title={levelTitle}
                    level={level}
                    progress={levelProgress}
                    variant="default"
                    clickable={false}
                />
                
                <p className="onboarding-xp-hint secondary-text">
                    You earn <strong>5 XP</strong> for every transaction you log,
                    <strong> 2 XP</strong> per streak day, 
                    and up to <strong>30 XP</strong> for completing a challenge.
                    Your title grows as you do.
                </p>
            </Section>

            {/* WHAT BLOSSOM CAN DO */}
            <Section title="What We'll Do Together">
                <div className="feature-cards">
                    {FEATURE_CARDS.map(card => (
                        <FeatureCard key={card.icon} {...card} />
                    ))}
                </div>
            </Section>

            {/* FAQ */}
            <Card className="onboarding-questions">
                <p className="onboarding-questions-title">Do you have any questions?</p>
                
                <p className="secondary-text">
                    I know this is a lot to take in. Check out my FAQ - it covers
                    everything from how XP works to what the mood tags are for.
                </p>

                <Button 
                    className="secondary" 
                    onClick={() => navigate("/settings/faq")}
                >
                    Show me how you work
                </Button>
            </Card>
        </div>
    )
}

export default OnboardingFlow