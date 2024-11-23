'use client';

import Button from "@/app/components/button";
import ListBudget from "./listBudget";
import './page.css';
import { ElementRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import TextInput from "@/app/components/textInput";
import { search_in_array } from "@/core/entities/libs";
import { Category } from "@/core/entities/category";
import Modal from "@/app/components/modal";
import Tag from "@/app/components/tag";
import { is_empty } from "@/core/entities/verify_empty_value";
import DateParser from "@/core/entities/date_parser";
import TopNav from "../topNav";
import { BudgetOutput, RequestUpdateBudget } from "@/core/interactions/budgets/updateBudgetUseCase";
import { CreationBudgetUseCaseRequest } from "@/core/interactions/budgets/creationBudgetUseCase";

export default function Budget() {
    const [currentModal, setCurrentModal] = useState(false);

    const [budgets, setBudgets] = useState<Array<BudgetOutput>>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesSearching, setCategoriesSearching] = useState<Category[]>([]);
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
    const [inputBudgetCategory, setInputBudgetCategory] = useState({title: '', category: '',  tag: '', target: 0, date_start: DateParser.now().toString(), period: '', period_time: 0,  date_end: DateParser.now().toString(), can_end: false, is_periodic: false});
    const [errorValidationBudgetCategory, setErrorValidationBudgetCategory] = useState<{title: string|null, category: string|null, period: string|null, period_time: string|null, date_start: string|null, target: string|null, date_end: string|null, tag: string|null}>({title: null, category: null, period: null, period_time: null, date_start: null, target: null, date_end: null, tag: null});
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

    async function get_all_Budgets() {
        try {
            const response_budget= await axios.get('/api/budget');
            const budgets = response_budget.data.budgets;
            for(let i = 0; i < budgets.length; i++ ) {
                budgets[i].start_date = DateParser.from_string(budgets[i].start_date);
                budgets[i].update_date = DateParser.from_string(budgets[i].update_date);
                budgets[i].end_date = DateParser.from_string(budgets[i].end_date);
            }

            setBudgets(budgets)
        } catch (error) {
            console.log(error);
        }
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


    async function save(is_update: boolean) {
        try {
            let do_submit = true;
            let errors = {}
            if (is_empty(inputBudgetCategory.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                console.log(errorValidationBudgetCategory)
                do_submit = false;
            } else {
                 errors = {...errors, title: null};
            }

            if (categoriesSelected.length == 0) {
                 errors = {...errors, category: 'Vous devez selection au moins une categorie'};
                do_submit = false;
            } else {
                 errors = {...errors, category: null};
            }

            if (is_empty(inputBudgetCategory.period)) {
                 errors = {...errors, period: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                 errors = {...errors, period: null};
            }

            if (inputBudgetCategory.period_time <= 0) {
                errors = {...errors, period_time: 'Doit etre superieur ou egale a 1'};
                do_submit = false;
            } else {
                errors = {...errors, period_time: null};
            }

            if (inputBudgetCategory.target <= 0) {
                errors = {...errors, target: 'Doit etre superieur a 0'};
                do_submit = false;
            } else {
                errors = {...errors, target: null};
            }

            if (do_submit) {
                let period = Object.entries(periods).find(key => key[0] === inputBudgetCategory.period);
                if (is_update) {
                    let budget: RequestUpdateBudget = {
                        id: idBudgetSelected!,
                        title: inputBudgetCategory.title,
                        categories: categoriesSelected.map(cat => cat.id),
                        period: period ? period[1] : '',
                        date_start: inputBudgetCategory.date_start,
                        period_time: inputBudgetCategory.period_time,
                        target: inputBudgetCategory.target,
                        tags: tagsSelected,
                        date_end: inputBudgetCategory.date_end,
                        is_archived: null
                    };

                    await axios.put(`/api/budget/${idBudgetSelected}`, budget);
                } else {
                    let budget: CreationBudgetUseCaseRequest = {
                        title: inputBudgetCategory.title,
                        categories: categoriesSelected.map(cat => cat.id),
                        period: period?period[1] : '',
                        date_start: inputBudgetCategory.date_start,
                        period_time: inputBudgetCategory.period_time,
                        target: inputBudgetCategory.target,
                        tags: tagsSelected,
                        date_end: inputBudgetCategory.date_end
                    };

                    await axios.post(`/api/budget`, budget);
                }
                
                handleCloseCurrentModal('category');
                get_all_Budgets();
            } else {
                // @ts-ignore
                setErrorValidationBudgetCategory(errors)
            }

        } catch(error: any) {
            console.log(error);
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
            <Modal isOpen={currentModal} onClose={() => {}}>
                <div className="add-budget-modal">
                    <div className="add-budget-modal-head flex justify-between">
                        <h3>*</h3>
                        <button onClick={() => handleCloseCurrentModal('category')} className="close-button">&#x2715;</button>
                    </div>
                    
                    <TextInput title="Nom budget" name="title" type="text" value={inputBudgetCategory.title} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.title} overOnBlur={undefined} />
                    <TextInput title="Categorie" name="category" type="text" value={inputBudgetCategory.category} onChange={handleChangeCategories} options={categoriesSearching.map(cat => cat.title)} onClickOption={handleSelectClickCategoriesModal} error={errorValidationBudgetCategory.category}  overOnBlur={undefined} /> 
                    <div className="flex flex-wrap" style={{marginTop: "-12px"}}>
                        {
                            categoriesSelected.map((category: Category, key: any) => 
                                <Tag key={key} title={category.title} onDelete={() => removeCategoriesSelected(category.title)} color={undefined}/>
                            )
                        }
                    </div>
                    <TextInput title="Date" name="date_start" type="date" value={inputBudgetCategory.date_start} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.date_start}  overOnBlur={undefined} />
                    <div>
                        <input type="checkbox" name="is_periodic" onChange={handleChangeCategories} checked={inputBudgetCategory.is_periodic} />
                        <label> Is Periodic</label>
                    </div>
                    {
                        inputBudgetCategory.is_periodic ? 
                        <>
                            <TextInput title="Periode" name="period" type="text" value={inputBudgetCategory.period} onChange={() => {}} options={Object.keys(periods)} onClickOption={handleSelectClickCategoriesModal} error={errorValidationBudgetCategory.period}  overOnBlur={undefined} />
                            <div style={{width: '45%'}}>
                                <TextInput title="Nb Periode" name="period_time" type="number" value={inputBudgetCategory.period_time} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.period_time}  overOnBlur={undefined} />  
                            </div>
                        </>
                        :
                        <></>
                    }
                    
                    <div style={{width: '60%'}}>
                        <TextInput title="Cible" name="target" type="number" value={inputBudgetCategory.target} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.target}  overOnBlur={undefined} />  
                    </div>

                    <TextInput title="Tag" name="tag" type="text" value={inputBudgetCategory.tag} onChange={handleChangeCategories} options={tagsSearching} onClickOption={handleSelectTagClick} error={errorValidationBudgetCategory.tag} overOnBlur={() => handleSelectTagClick('tag', inputBudgetCategory.tag)} /> 
                    <div className="flex flex-wrap" style={{marginTop: "-12px"}}>
                        {
                            tagsSelected.map((tag: string, key: any) => 
                                <Tag key={key} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined}/>
                            )
                        }
                    </div>
                    <div>
                        <input type="checkbox" name="can_end" onChange={handleChangeCategories} checked={inputBudgetCategory.is_periodic} />
                        <label> Ajouter limite</label>
                    </div>
                    {
                        inputBudgetCategory.can_end ?
                            <TextInput title="Date de fin" name="date_end" type="date" value={inputBudgetCategory.date_end} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.date_end}  overOnBlur={undefined} />
                        :
                            <></>
                    }
                    <div className="flex justify-center">
                        <Button title={isModification ? "Modifier Budget" : "Creer Budget"} onClick={isModification ?  () => save(true) : () => save(false)} backgroundColor="#6755D7" colorText="white" />
                    </div> 
                </div>
            </Modal>
        </>
    )
}