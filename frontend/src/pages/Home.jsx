import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import "../styles/pages/Home.css"

function Home() {
    return (
        <div className="home-layout">
            <div className="home-content">
                <GreetingHeader />

                <Section title="Stats">
                    <PrimaryGoalCard />
                    <TopCategoryCard />
                </Section>

                <Section title="Recent">
                    <TransactionCard category="Food" merchant="Lidl" date="March 3, 2026" mood="calm" type="Expense" amount={130} currency="RON" icon={
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_185_1610)">
                                <path d="M9.5 5.16816V2.37516C9.5 2.1652 9.58341 1.96384 9.73187 1.81537C9.88034 1.6669 10.0817 1.5835 10.2917 1.5835" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14.4376 16.6251C16.3687 14.4413 17.429 11.6235 17.4167 8.70839C17.4166 7.79145 17.1512 6.89411 16.6524 6.12469C16.1537 5.35528 15.4429 4.74667 14.6058 4.37234C13.7687 3.99801 12.8412 3.87396 11.9352 4.01515C11.0292 4.15635 10.1834 4.55676 9.5 5.16806C8.81655 4.55676 7.97078 4.15635 7.06477 4.01515C6.15876 3.87396 5.23125 3.99801 4.3942 4.37234C3.55715 4.74667 2.84633 5.35528 2.34755 6.12469C1.84877 6.89411 1.58335 7.79145 1.58333 8.70839C1.57834 11.6222 2.63772 14.4374 4.56237 16.6251C4.91681 17.0216 5.39407 17.2877 5.91771 17.3807C6.44135 17.4737 6.98106 17.3883 7.45037 17.1381C8.08114 16.8015 8.78507 16.6255 9.5 16.6255C10.2149 16.6255 10.9189 16.8015 11.5496 17.1381C12.0189 17.3883 12.5586 17.4737 13.0823 17.3807C13.6059 17.2877 14.0832 17.0216 14.4376 16.6251Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_185_1610">
                                    <rect width="19" height="19" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    }/>

                    <TransactionCard category="Coffee" merchant="Tucano Coffee" date="March 2, 2026" mood="anxious" type="Expense" amount={25} currency="RON" icon={
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.91666 1.5835V3.16683" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.0833 1.5835V3.16683" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.6667 6.3335C12.8766 6.3335 13.078 6.4169 13.2265 6.56537C13.3749 6.71384 13.4583 6.9152 13.4583 7.12516V13.4585C13.4583 14.2983 13.1247 15.1038 12.5308 15.6977C11.937 16.2915 11.1315 16.6252 10.2917 16.6252H5.54167C4.70181 16.6252 3.89636 16.2915 3.3025 15.6977C2.70863 15.1038 2.375 14.2983 2.375 13.4585V7.12516C2.375 6.9152 2.45841 6.71384 2.60687 6.56537C2.75534 6.4169 2.9567 6.3335 3.16667 6.3335H14.25C15.0899 6.3335 15.8953 6.66713 16.4892 7.26099C17.083 7.85486 17.4167 8.66031 17.4167 9.50016C17.4167 10.34 17.083 11.1455 16.4892 11.7393C15.8953 12.3332 15.0899 12.6668 14.25 12.6668H13.4583" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.75 1.5835V3.16683" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    }/>

                    <TransactionCard category="Pets" merchant="Animax" date="March 1, 2026" mood="happy" type="Expense" amount={12} currency="RON" icon={
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_185_1634)">
                                <path d="M8.70833 4.75016C9.58278 4.75016 10.2917 4.04128 10.2917 3.16683C10.2917 2.29238 9.58278 1.5835 8.70833 1.5835C7.83388 1.5835 7.125 2.29238 7.125 3.16683C7.125 4.04128 7.83388 4.75016 8.70833 4.75016Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14.25 7.91667C15.1244 7.91667 15.8333 7.20778 15.8333 6.33333C15.8333 5.45888 15.1244 4.75 14.25 4.75C13.3755 4.75 12.6667 5.45888 12.6667 6.33333C12.6667 7.20778 13.3755 7.91667 14.25 7.91667Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.8333 14.2502C16.7078 14.2502 17.4167 13.5413 17.4167 12.6668C17.4167 11.7924 16.7078 11.0835 15.8333 11.0835C14.9589 11.0835 14.25 11.7924 14.25 12.6668C14.25 13.5413 14.9589 14.2502 15.8333 14.2502Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.125 7.9165C7.64482 7.9165 8.15954 8.01889 8.63979 8.21781C9.12004 8.41674 9.5564 8.70831 9.92397 9.07587C10.2915 9.44344 10.5831 9.8798 10.782 10.36C10.981 10.8403 11.0833 11.355 11.0833 11.8748V14.6457C11.0831 15.3079 10.8458 15.9481 10.4142 16.4504C9.98271 16.9527 9.38557 17.2838 8.73097 17.3838C8.07637 17.4838 7.40759 17.3461 6.84578 16.9956C6.28396 16.645 5.86626 16.1049 5.66834 15.473C5.33056 14.3831 4.61806 13.6693 3.53084 13.3315C2.89923 13.1337 2.3593 12.7163 2.00875 12.1549C1.65819 11.5935 1.52017 10.9252 1.61966 10.2708C1.71915 9.61648 2.04958 9.01937 2.55115 8.58753C3.05273 8.15569 3.69231 7.91766 4.35417 7.9165H7.125Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </g>
                            <defs>
                                <clipPath id="clip0_185_1634">
                                    <rect width="19" height="19" fill="white"/>
                                </clipPath>
                            </defs>
                        </svg>
                    }/>
                    
                    <Button>View All Transactions</Button>
                </Section>
            </div>
        </div>
    )
}

export default Home