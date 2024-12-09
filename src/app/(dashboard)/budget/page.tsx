'use client';

import Button from "@/app/components/button";
import ListBudget from "./listBudget";
import './page.css';
import { ElementRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import TextInput from "@/app/components/textInput";
import Modal from "@/app/components/modal";
import Tag from "@/app/components/tag";
import TopNav from "../topNav";
import { BudgetOutput, RequestUpdateBudget } from "@/core/interactions/budgets/updateBudgetUseCase";
import { CreationBudgetUseCaseRequest } from "@/core/interactions/budgets/creationBudgetUseCase";

export default function Budget() {
    const [currentModal, setCurrentModal] = useState(false);

    const [budgets, setBudgets] = useState<Array<BudgetOutput>>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesSearching, setCategoriesSearching] = useState<Category[]>([]);
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
    
    const periods = {Mois: 'Month', Semaine: 'Week', Année: 'Year'}

    const [tags, setTags] = useState<string[]>([]);
    const [tagsSearching, setTagsSearching] = useState<string[]>([]);
    const [tagsSelected, setTagsSelected] = useState<string[]>([]);

    const [isModification, setIsModification] = useState(false);
    const [idBudgetSelected, setidBudgetSelected] = useState<string|null>(null);

    function handleChangeCategories(event: any) {
        if (event.target.name === 'category') {
            let categories_found = search_in_array(event.target.value, categories.map(category => category.title));
            setCategoriesSearching(categories.filter(category => categories_found.includes(category.title)));
        }

        if (event.target.name === 'tag') {
            let tags_found = search_in_array(event.target.value, tags);
            setTagsSearching(tags_found);
        }

        setInputBudgetCategory({...inputBudgetCategory, [event.target.name]: event.target.value});
    }

    function handleSelectClickCategoriesModal(name: any, value: any) {
        setInputBudgetCategory({...inputBudgetCategory, [name]: value});
        let category = categories.find(cat => cat.title === value);
        if (category !== undefined && name !== 'period') {
            setCategoriesSelected([...categoriesSelected, category]);
        } 
    }
    function removeCategoriesSelected(name: string) {
        let categories = Object.assign([], categoriesSelected);
        categories.splice(categories.findIndex((category: Category) => category.title === name), 1);
        setCategoriesSelected(categories);
    }
    function cleanCategoryInput() {
        setInputBudgetCategory({title: '', category: '', tag: '', period: '', period_time: 0, target: 0, date_start: DateParser.now().toString(), date_end: '', can_end: false, is_periodic: false});
        setErrorValidationBudgetCategory({title: null, category: null, period: null, period_time: null, target: null, date_start: "", date_end: '', tag: ''});
        setCategoriesSelected([]);
    }

    function handleChangeTags(event: any) {
        if (event.target.name === 'tag') {
            let tags_found = search_in_array(event.target.value, tags);
            setTagsSearching(tags_found);
        }
        setInputBudgetCategory({...inputBudgetCategory, [event.target.name]: event.target.value});
    }

    function handleSelectTagClick(name: any, value: any) {
        setInputBudgetCategory({...inputBudgetCategory, [name]: ""});
        if (!tagsSelected.includes(value) && !is_empty(value)){
            setTagsSelected([...tagsSelected, value]);
        }
    }
    function removeTagSelected(name: string) {
        let tags = Object.assign([], tagsSelected);
        tags.splice(tags.indexOf(name), 1);
        setTagsSelected(tags);
    }    

    async function get_all_category() {
        try {
            const response_categories = await axios.get('/api/category');
            let categories: Category[] = response_categories.data.categories;
            setCategories(categories)
            setCategoriesSearching(categories)
        } catch(error) {
            console.log(error);
        }
    }

    async function get_all_tags() {
        try {
            const response_categories = await axios.get('/api/tag');
            let tags: string[] = response_categories.data.tags;
            setTags(tags)
            setTagsSearching(tags)
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        get_all_Budgets();
        get_all_category();
        get_all_tags();
    }, [])

    function handleOpeningCurrentModal() {
        setCurrentModal(true);
    }
    function handleCloseCurrentModal(name: string) {
        setCurrentModal(false);
        cleanCategoryInput();
        setIsModification(false);
        setidBudgetSelected(null);
    }

    function handleUpdateBudget(budget: BudgetOutput)  {
        setIsModification(true);
        setidBudgetSelected(budget.id);

        setCurrentModal(true);
        let period = Object.entries(periods).find(key => key[1] === budget.period);
     
        setInputBudgetCategory({
            title: budget.title,
            period: period ? period[0] : '',
            period_time: budget.period_time,
            target: budget.target,
            date_start: budget.start_date.toString(),
            tag: '',
            date_end: '',
            category: '',
            can_end: false,
            is_periodic: false
        });
        setCategoriesSelected(budget.categories);
    }

    async function deleteBudget(id: string) {
        try {
            let isOk = confirm('Voulez vous vraiment le supprimer');

            if (isOk) {
                await axios.delete(`/api/budget/${id}`);
            }
            get_all_Budgets();
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <TopNav title='Les budgets'/>
            <div className="budgets">
                <div>
                    <div>                        
                        <Button backgroundColor="white" colorText="#6755D7" title="Ajouter Budget" onClick={() => handleOpeningCurrentModal()}/>
                    </div>
                </div>
                <div className="list">
                    <ListBudget budgets={budgets} onDelete={deleteBudget} onUpdate={handleUpdateBudget} />
                </div>
            </div>
        </>
    )
}