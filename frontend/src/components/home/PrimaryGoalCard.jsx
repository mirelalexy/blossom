import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";

import "./PrimaryGoalCard.css"

function PrimaryGoalCard() {
    const percent = 50;
    const sum = 2500;
    const currency = "RON";
    const primaryGoal = "Bali";

    return (
        <Card 
            className="primary-goal-card" 
            title="Primary Goal" 
            icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                <path d="M11.0833 7.54933V5.54167C11.0833 4.70181 11.417 3.89636 12.0108 3.3025C12.6047 2.70863 13.4101 2.375 14.25 2.375H15.4375C15.5425 2.375 15.6432 2.4167 15.7174 2.49094C15.7916 2.56517 15.8333 2.66585 15.8333 2.77083V3.95833C15.8333 4.79819 15.4997 5.60364 14.9058 6.19751C14.312 6.79137 13.5065 7.125 12.6667 7.125C11.8268 7.125 11.0214 7.45863 10.4275 8.0525C9.83363 8.64636 9.5 9.45181 9.5 10.2917C9.5 11.875 10.2917 12.6667 10.2917 14.25C10.2917 15.1065 10.0139 15.9398 9.5 16.625" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.16666 7.12516C3.75475 6.6841 4.45404 6.41551 5.18618 6.34949C5.91832 6.28348 6.65438 6.42264 7.31188 6.75139C7.96939 7.08014 8.52235 7.58549 8.90882 8.21081C9.29529 8.83613 9.5 9.55672 9.5 10.2918C8.91191 10.7329 8.21262 11.0015 7.48048 11.0675C6.74834 11.1335 6.01228 10.9944 5.35478 10.6656C4.69728 10.3369 4.14431 9.83151 3.75784 9.20618C3.37137 8.58086 3.16666 7.86027 3.16666 7.12516Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3.95834 16.625H15.0417" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            }
        >
            <p>{primaryGoal}</p>
            <div className="goal-progress">
                <ProgressBar progress={percent}/>

                <div className="goal-meta">
                    <span>{sum} {currency} saved</span>
                    <span>{percent}%</span>
                </div>
            </div>
        </Card>
    )
}

export default PrimaryGoalCard;