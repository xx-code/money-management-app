'use client';

import Dropdown from "@/app/components/dropdown";
import ListTransaction from "../home/listTransaction";
import Button from "@/app/components/button";
import CardInfoResume from "./cardInfoResume";

import './page.css';
import Tag from "@/app/components/tag";
import TextInput from "@/app/components/textInput";
import TransactionPagination from "../home/transactionPagination";
import { useEffect, useState } from "react";
import { Transaction } from "@/core/entities/transaction";
import { AccountDisplay } from "@/core/entities/account";
import axios from "axios";
import DateParser from "@/core/entities/date_parser";
import { Category } from "@/core/entities/category";
import { search_in_array } from "@/core/entities/libs";
import { AnyAaaaRecord } from "dns";

export default function Transactions() {
    const [pagination, setPagination] = useState({current: 1, max_pages: 1});
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const [account, setAccount] = useState<AccountDisplay|null>(null);
    const [accounts, setAccounts] = useState<AccountDisplay[]>([]);

    const [filter, setFilter] = useState({category: '', tag: ''});
    const [searchingCategories, setSearchingCategories] = useState<Category[]>([]);
    const [searchingTags, setSearchingTags] = useState<string[]>([]); 
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const [total_spend, setTotalSpend] = useState<number|null>(null);
    const [total_gains, setTotalGains] = useState<number|null>(null); 

    function change_list_transaction(page: number) {
        if (page >= 1 || page <= pagination.max_pages) {
            get_transactions(page);
        }
    }

    function handleFilter(event: any) {
        if (event.target.name === 'tag') {
            let tag_found = search_in_array(event.target.value, tags);
            setSearchingTags(tag_found);
        }
  
        if (event.target.name === 'category') {
            let categories_found = search_in_array(event.target.value, categories.map(category => category.title));
            setSearchingCategories(categories.filter(category => categories_found.includes(category.title)));
        }
  
        setFilter({...filter, [event.target.name]: event.target.value});
    }

    function handleSelect(name: any, value: any) {
        if (name === 'tag' && !selectedTags.includes(value)) {
            setSelectedTags([...selectedTags, value])
        }
        if (name === 'category' && !selectedCategories.includes(value)) {
            let category_found = categories.find(category => category.title === value)
            setSelectedCategories([...selectedCategories, category_found!]);
        }
    }

    // TODO: REfactor category and tag to use an object
    function removeSelected(name: string, value: string) {
        
        if (name === 'tag') {
            let work_array = Object.assign([], selectedTags);
            work_array.splice(work_array.indexOf(value), 1);
            setSelectedTags(work_array);
        }

        if (name === 'category') {
            let work_array = Object.assign([], selectedCategories);
            work_array.splice(work_array.findIndex((cat:Category) => cat.title === value), 1);
            setSelectedCategories(work_array);
        }
    } 

    function cleanFilter() {
        setFilter({
            category: '',
            tag: ''
        });
        setSelectedTags([]);
        setSelectedCategories([]);
    }

    function handleDropDownChange (event: React.ChangeEvent<HTMLInputElement>) {
        let account: AccountDisplay|undefined = accounts.find((value: AccountDisplay, index) => value.title == event.target.value);
        setAccount(account!);
    };

    async function delete_transaction(id: string) {
        try {
          await axios.delete(`/api/transaction/${id}`);
          setup_data();
        } catch (err: any) {
          console.log(err);
          alert(err.data);
        }
      }
    
    async function get_all_categories() {
        try {
            const response_categories = await axios.get('/api/category');
            let categories: Category[] = response_categories.data.categories;
            setCategories(categories);
            setSearchingCategories(categories);
        } catch(error:any) {
            console.log(error);
            alert(error.response.data);
        }
    }

    async function get_all_tags() {
        try {
            const response_categories = await axios.get('/api/tag');
            let tags: string[] = response_categories.data.tags;
            setTags(tags);
            setSearchingTags(tags);
        } catch(error: any) {
            console.log(error);
            alert(error.response.data);
        }
    }

    async function get_all_accounts(do_refresh: boolean) {
        fetch('/api/account')
        .then((res) => res.json())
        .then((data) => {
            let accounts = Object.assign([], data.accounts);
            let balance = accounts.reduce((sum:number, current:AccountDisplay) => sum + current.balance, 0)
            accounts.unshift({
                id: "all",
                title: "Tous les comptes",
                credit_limit: 0,
                credit_value: 0,
                balance: balance
            });
            if (!do_refresh)  {
                setAccount(accounts[0]);
            }
            setAccounts(accounts);
        })
    }


    function get_total_balance(type_transaction: string): Promise<number> {
        return new Promise(async (resolve, reject) => {
            try {      
                let request_filter = {
                    accounts_id: account!== null && account?.id !== 'all' ? [account?.id] : [],
                    tags_filter: selectedTags,
                    categories_filter: selectedCategories.map(cat => cat.id),
                    date_start: null,
                    date_end: null,
                    type: type_transaction
                }
                
                const response_past = await axios.post('/api/transaction/get_balance_by', request_filter);
                const balance = response_past.data.balance;

                resolve(balance);
            } catch (error) {
            reject(error);
            }
        })
    };

    async function get_total_spend() {
        try { 
            let balance = await get_total_balance('Debit');
            setTotalSpend(balance);
        } catch (error: any) {
            console.log(error);
            alert(error.response.data);
        }
    }

    async function get_total_gain() {
        try {
            let balance = await get_total_balance('Credit');
            setTotalGains(balance);
        } catch (error: any) {
            console.log(error);
            alert(error.response.data);
        }
    }

    async function get_transactions(current_page: number) {
        let height_win_need = window.innerHeight/2;
        let size = Math.floor(height_win_need / 80);

        try {
            let request_filter = {
                page: current_page,
                size: size,
                account_filter: account!== null && account?.id !== 'all' ? [account?.id] : [],
                category_filter: selectedCategories.map(cat => cat.id),
                tag_filter: selectedTags,
                date_start: null,
                date_end: null,
            }
            let response = await axios.post('/api/pagination_transactions', request_filter);
        
            setPagination({current: response.data.current_page, max_pages: response.data.max_pages});
            let transactions: Transaction[] = [];
            for (let transaction of response.data.transactions) {
                transaction.record.date = (new DateParser(transaction.record.date['year'], transaction.record.date['month'], transaction.record.date['day'])).toString();
                transactions.push(transaction);
            }
            setTransactions(transactions);
        } catch(err) {
            console.log(err);
        }
    }

    async function setup_data() {
        get_transactions(pagination.current);
        get_all_categories();
        get_all_tags();
        get_total_spend();
        get_total_gain();
    }

    useEffect(() => {
        get_all_accounts(false);
    }, [])

    useEffect(() => {
        setup_data();
    }, [account, selectedCategories, selectedTags])

    return (
        <div className="transactions">
            <div className="top-info">
                <Dropdown values={accounts.map(account => account.title)} customClassName="dropdown-account" backgroundColor="#313343" color="white" onChange={handleDropDownChange} />
                <div className="list-info"> 
                    <CardInfoResume total_spend={total_spend} total_earning={total_gains} /> 
                    <div>
                        <Dropdown values={['Prix decroissant', 'Prix croissant']} customClassName="" backgroundColor="white" color="#6755D7" onChange={undefined} />
                    </div>
                </div>
            </div>
            <div className="transactions-content">
                <div className="left-content">
                    <div className="list">
                        <ListTransaction transactions={transactions} onEdit={undefined} onDelete={delete_transaction} />
                        <TransactionPagination 
                            current_page={pagination.current} 
                            max_page={pagination.max_pages} 
                            precedent={() => change_list_transaction(pagination.current - 1)} 
                            next={() => change_list_transaction(pagination.current + 1)}
                        />
                    </div>
                </div>
                <div className="right-content">
                    <div className="filter-part">
                        <div className="filter-part-content">
                            <div className="filter-title-content">
                                <h3>Filtrage</h3>
                                <Button backgroundColor="transparent" colorText="#6755D7" title="reintialise" onClick={cleanFilter}/>
                            </div>
                            <div className="filter-dropdown-content">
                                <TextInput type="text" title={"Categorie"} value={filter.category} name="category" onChange={handleFilter} options={searchingCategories.map(cat => cat.title)} onClickOption={handleSelect} error={null} overOnBlur={undefined} />
                                <div className="flex flex-wrap">
                                    {
                                        selectedCategories.map((category, index) => <Tag key={index} title={category.title} onDelete={() => removeSelected('category', category.title)} color={undefined}/> )
                                    }
                                </div>
                            </div>
                            <div className="filter-dropdown-content">
                                <TextInput type="text" title={"Tag"} value={filter.tag} name={"tag"} onChange={handleFilter} options={searchingTags} onClickOption={handleSelect} error={null} overOnBlur={undefined} />
                                <div className="flex flex-wrap">
                                    {
                                        selectedTags.map((tag, index) => <Tag key={index} title={tag} onDelete={() => removeSelected('tag', tag)} color={undefined}/> )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}