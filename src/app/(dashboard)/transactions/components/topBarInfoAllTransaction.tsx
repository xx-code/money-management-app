import Dropdown from "@/app/components/dropdown"
import { Money } from "@/core/domains/helpers"
import CardInfoResume from "./cardInfoResume"

export type CardResumeAccount = {
    accountId: string
    accountTitle: string
}


type Props = {
    accounts: CardResumeAccount[]
    accountSelected: number
    onSelectAccount: (accountId: string) => void 
    totalSpend: Money | undefined
    totalEarning: Money | undefined
}

export default function TopBarInfoAllTransaction({accounts, onSelectAccount, totalEarning, totalSpend, accountSelected} : Props) {
    return (
        <div className="top-info">
            <Dropdown 
                values={accounts.map(account => ({ value: account.accountTitle, returnValue: account.accountId}))} 
                customClassName="dropdown-account" 
                backgroundColor="#313343" 
                color="white" 
                onChange={(event: any) => onSelectAccount(event.target.value)} 
                valueSelected={accounts.length > 0 ? accounts[accountSelected].accountId : ""} 
            />
            <div className="list-info"> 
                <CardInfoResume totalSpend={totalSpend} totalEarning={totalEarning} /> 
                <div>
                    <Dropdown 
                        values={[{ value: 'Prix decroissant', returnValue: "DESC" }, { value: 'Prix croissant', returnValue: 'ASC' }]}
                        customClassName=""
                        backgroundColor="white"
                        color="#6755D7"
                        onChange={undefined} 
                        valueSelected={""}                    
                    />
                </div>
            </div>
        </div>
    )
}