import { TransactionModel } from "@/app/api/models/transaction";
import { ApiTransactionPaginationResponse } from "@/app/api/pagination_transactions/route";
import { ApiGetBalanceResponse } from "@/app/api/transaction/get_balance_by/route";
import { mapperPeriod, Period } from "@/core/domains/constants";
import { determinedStartEndDate, Money } from "@/core/domains/helpers";
import { RequestGetBalanceBy } from "@/core/interactions/transaction/getBalanceByUseCase";
import { RequestGetPagination } from "@/core/interactions/transaction/getPaginationTransactionUseCase";
import axios from "axios";
import { useState } from "react";

export const useTransactionPagination = () => {
    const [pagination, setPagination] = useState({currentPage: 1, maxPage: 1})
    const [transactions, setTransactions] = useState<TransactionModel[]>([])
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
        
              resolve({pastMonth: new Money(Math.abs(balanceLastMonth.balance)) , currentMonth: new Money(Math.abs(balanceCurrentMonth.balance))});
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

export const useBalances = () => {
    const [totalSpend, setTotalSpend] = useState<Money>();
    const [totalGains, setTotalGains] = useState<Money>();

    const getTotalBalance = async (filter: RequestGetBalanceBy): Promise<Money> => {
        return new Promise(async (resolve, reject) => {
            try {
              const res = await axios.post('/api/transaction/get_balance_by', filter);
              const balance: ApiGetBalanceResponse = res.data
        
              resolve(new Money(Math.abs(balance.balance)))
            } catch (error) {
              reject(error);
            }
        })
    }      

    const fetchTotals = async (request: RequestGetPagination) => {
        try {
            let requestDebit: RequestGetBalanceBy  = {
                accounts_id: request.account_filter,
                tags_filter: request.tag_filter,
                categories_filter: request.category_filter,
                date_start: request.date_start,
                date_end: request.date_end,
                type: "Debit",
                price: undefined
            }
            const spend = await getTotalBalance(requestDebit);

            let requestCredit: RequestGetBalanceBy  = {
                accounts_id: request.account_filter,
                tags_filter: request.tag_filter,
                categories_filter: request.category_filter,
                date_start: request.date_start,
                date_end: request.date_end,
                type: "Credit",
                price: undefined
            }
            const gains = await getTotalBalance(requestCredit);

            setTotalSpend(spend);
            setTotalGains(gains);
        } catch (error) {
            console.error(error);
        }
    };

    return { totalSpend, totalGains, fetchTotals };
}