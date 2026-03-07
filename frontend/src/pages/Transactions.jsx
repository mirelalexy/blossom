import GreetingHeader from "../components/home/GreetingHeader"
import PrimaryGoalCard from "../components/home/PrimaryGoalCard"
import TopCategoryCard from "../components/home/TopCategoryCard"
import TransactionCard from "../components/home/TransactionCard"
import Section from "../components/ui/Section"
import Button from "../components/ui/Button"

import "../styles/pages/Transactions.css"

function Transactions() {
    return (
        <div className="transactions-layout">
            <div className="transactions-content">
                <div className="transactions-header">
                    <div className="transactions-header-first-row">
                        <div className="filter-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path d="M8.74999 17.5C8.74991 17.6626 8.79515 17.822 8.88062 17.9603C8.96609 18.0987 9.08841 18.2104 9.23387 18.2831L10.9839 19.1581C11.1173 19.2248 11.2656 19.2563 11.4146 19.2495C11.5636 19.2428 11.7084 19.198 11.8353 19.1196C11.9621 19.0411 12.0668 18.9315 12.1394 18.8012C12.212 18.6709 12.2501 18.5242 12.25 18.375V12.25C12.2502 11.8163 12.4114 11.3982 12.7024 11.0766L19.0225 4.08625C19.1358 3.96074 19.2103 3.8051 19.237 3.63815C19.2636 3.4712 19.2414 3.30009 19.1729 3.14552C19.1044 2.99094 18.9926 2.85952 18.851 2.76715C18.7094 2.67477 18.5441 2.6254 18.375 2.625H2.62499C2.45577 2.62506 2.2902 2.67419 2.14833 2.76643C2.00647 2.85867 1.89439 2.99008 1.82568 3.14472C1.75697 3.29936 1.73458 3.47061 1.76121 3.63772C1.78784 3.80483 1.86236 3.96063 1.97574 4.08625L8.29761 11.0766C8.58858 11.3982 8.74979 11.8163 8.74999 12.25V17.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h1>Transactions</h1>
                        <div className="search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                <path d="M18.375 18.3749L14.5775 14.5774" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.625 16.625C13.491 16.625 16.625 13.491 16.625 9.625C16.625 5.75901 13.491 2.625 9.625 2.625C5.75901 2.625 2.625 5.75901 2.625 9.625C2.625 13.491 5.75901 16.625 9.625 16.625Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 className="transactions-header-second-row">March 2026</h2>
                </div>

                <Section title="Overall" className="transactions-overall">
                    <div>
                        <p>Budget left: <span>1,720 RON</span></p>
                        <p>This month spent: <span>1,280 RON</span></p>
                    </div>
                </Section>

                <Section title="Upcoming">
                    <TransactionCard category="Gaming" merchant="PlayStation Plus" date="March 4, 2026" type="Expense" amount={79} currency="RON" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M4.75 8.7085H7.91667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.33334 7.125V10.2917" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.875 9.5H11.885" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M14.25 7.9165H14.26" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.7117 3.9585H5.28834C4.50481 3.95868 3.74917 4.24934 3.1675 4.77428C2.58582 5.29922 2.21941 6.02118 2.13909 6.80058C2.13434 6.84175 2.13118 6.88054 2.12564 6.92091C2.06151 7.4545 1.58334 11.4445 1.58334 12.6668C1.58334 13.2967 1.83357 13.9008 2.27896 14.3462C2.72436 14.7916 3.32845 15.0418 3.95834 15.0418C4.75001 15.0418 5.14584 14.646 5.54168 14.2502L6.66109 13.1307C6.95796 12.8338 7.36062 12.6669 7.78051 12.6668H11.2195C11.6394 12.6669 12.0421 12.8338 12.3389 13.1307L13.4583 14.2502C13.8542 14.646 14.25 15.0418 15.0417 15.0418C15.6716 15.0418 16.2757 14.7916 16.7211 14.3462C17.1665 13.9008 17.4167 13.2967 17.4167 12.6668C17.4167 11.4437 16.9385 7.4545 16.8744 6.92091C16.8688 6.88133 16.8657 6.84175 16.8609 6.80137C16.7808 6.02183 16.4145 5.29968 15.8328 4.77457C15.2511 4.24947 14.4953 3.9587 13.7117 3.9585Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    }/>

                    <TransactionCard category="Entertainment" merchant="Netflix" date="March 12, 2026" type="Expense" amount={30} currency="RON" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M9.73434 2.74219L12.1252 5.87402" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M15.9917 4.74992L2.37501 8.70826L1.66251 6.80826C1.42501 5.93742 1.90001 5.06659 2.69168 4.82909L13.3792 1.66242C14.25 1.42492 15.1208 1.89992 15.3583 2.69159L15.9917 4.74992Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.375 8.7085H16.625V15.0418C16.625 15.4618 16.4582 15.8645 16.1613 16.1614C15.8643 16.4583 15.4616 16.6252 15.0417 16.6252H3.95833C3.53841 16.6252 3.13568 16.4583 2.83875 16.1614C2.54181 15.8645 2.375 15.4618 2.375 15.0418V8.7085Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.89249 4.17676L7.34665 7.26347" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    }/>

                    <TransactionCard category="Income" merchant="Salary" date="March 14, 2026" type="Income" amount={4000} currency="RON" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                            <path d="M15.8333 4.75H3.16668C2.29223 4.75 1.58334 5.45888 1.58334 6.33333V12.6667C1.58334 13.5411 2.29223 14.25 3.16668 14.25H15.8333C16.7078 14.25 17.4167 13.5411 17.4167 12.6667V6.33333C17.4167 5.45888 16.7078 4.75 15.8333 4.75Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M9.49999 11.0832C10.3744 11.0832 11.0833 10.3743 11.0833 9.49984C11.0833 8.62539 10.3744 7.9165 9.49999 7.9165C8.62554 7.9165 7.91666 8.62539 7.91666 9.49984C7.91666 10.3743 8.62554 11.0832 9.49999 11.0832Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M4.75 9.5H4.75792M14.25 9.5H14.2579" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    }/>
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
                    
                    <Button>Add Transaction</Button>
                </Section>
            </div>
        </div>
    )
}

export default Transactions