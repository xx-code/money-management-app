import { ApiGetAllAccountResponse } from "@/app/api/account/route"
import axios from "axios"
import { useState } from "react"

export function useAccountsFetching() {
    const [accounts, setAccounts] = useState<ApiGetAllAccountResponse[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<any|null>(null)

    const fetchAllAccounts = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/account')
            let accounts:ApiGetAllAccountResponse[] = response.data
            
            let totalBalance = accounts.reduce((sum, current) => sum + current.balance, 0)
            accounts.unshift({account_id: '', balance: totalBalance, title: "Tout"})
         
            setAccounts(accounts)
        } catch(error: any) {
            if (error.response) {
                setError(error.response.data)
            } else if (error.request) {
                setError(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setError(unknowError)
            }
        } finally {
            setLoading(false)
        }
    }
    
    return {accounts, loading, error, fetchAllAccounts}
}