import { ApiTransactionPaginationResponse, ApiTransactionResponse } from "@/app/api/pagination_transactions/route";
import { ApiGetBalanceResponse } from "@/app/api/transaction/get_balance_by/route";
import { mapperPeriod, Period } from "@/core/domains/constants";
import { determinedStartEndDate, Money } from "@/core/domains/helpers";
import { RequestGetPagination } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import axios from "axios";
import { useState } from "react";

export const useTransactionPagination = () => {
    const [pagination, setPagination] = useState({currentPage: 1, maxPage: 1})
    const [transactions, setTransactions] = useState<ApiTransactionResponse[]>([])
    const [errorPagination, setErrorPagination] = useState<any|null>(null)

    const fetchTransactionPagination = async (request: RequestGetPagination) => {
        try {
            let response = await axios.post('/api/pagination_transactions', request)
            let data:ApiTransactionPaginationResponse = response.data
            setPagination({currentPage: request.page, maxPage: data.max_pages})
            setTransactions(data.transactions)
        } catch(error: any) {
            if (error.response) {
                setErrorPagination(error.response.data)
            } else if (error.request) {
                setErrorPagination(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setErrorPagination(unknowError)
            }
        }
    } 

    return {pagination, transactions, fetchTransactionPagination, errorPagination}
}

export type ResumeMonth = {
    pastMonth: Money|undefined
    currentMonth: Money|undefined
} 

export const useResumeMonth = () => {
    const [totalSpend, setTotalSpend] = useState<ResumeMonth>({ pastMonth: undefined, currentMonth: undefined });
    const [totalGains, setTotalGains] = useState<ResumeMonth>({ pastMonth: undefined, currentMonth: undefined });

    const getTotalBalance = async (type: string): Promise<ResumeMonth> => {
        return new Promise(async (resolve, reject) => {
            try {
              let today = new Date();
              let past = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              
              let currentMonthDate = determinedStartEndDate(today, Period.MONTH, 1);
              let pastMonthDate = determinedStartEndDate(past, Period.MONTH, 1);
        
              const resPast = await axios.post('/api/transaction/get_balance_by', { type: type, date_start: pastMonthDate.start_date.toString(), date_end: pastMonthDate.end_date.toString() });
              const balanceLastMonth: ApiGetBalanceResponse = resPast.data
        
              const resCurrent = await axios.post('/api/transaction/get_balance_by', { type: type, date_start: currentMonthDate.start_date.toString(), date_end: currentMonthDate.end_date.toString() });
              const balanceCurrentMonth: ApiGetBalanceResponse = resCurrent.data
        
              resolve({pastMonth: new Money(balanceLastMonth.balance) , currentMonth: new Money(balanceCurrentMonth.balance)});
            } catch (error) {
              reject(error);
            }
        })
    }

    const fetchTotals = async () => {
        try {
        const spend = await getTotalBalance("DEBIT");
        console.log(spend)
        const gains = await getTotalBalance("CREDIT");
        setTotalSpend(spend);
        setTotalGains(gains);
        } catch (error) {
        console.error(error);
        }
    };

    return { totalSpend, totalGains, fetchTotals };
}