'use client';

import Button from "@/app/components/button";
import ListBudget from "./listBudget";

import './page.css';
import { ElementRef, useEffect, useRef, useState } from "react";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, isBudgetCategory } from "@/core/entities/budget";
import axios from "axios";
import TextInput from "@/app/components/textInput";
import { search_in_array } from "@/core/entities/libs";
import { Category } from "@/core/entities/category";
import Modal from "@/app/components/modal";
import Tag from "@/app/components/tag";
import { is_empty } from "@/core/entities/verify_empty_value";
import DateParser from "@/core/entities/date_parser";
import TopNav from "../topNav";

export default function Budget() {
    const [currentModal, setCurrentModal] = useState({category: false, tag: false});

    const [budgets, setBudgets] = useState<Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>>([]);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoriesSearching, setCategoriesSearching] = useState<Category[]>([]);
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
    const [inputBudgetCategory, setInputBudgetCategory] = useState({title: '', category: '', target: 0, period: '', period_time: 0});
    const [errorValidationBudgetCategory, setErrorValidationBudgetCategory] = useState<{title: string|null, category: string|null, period: string|null, period_time: string|null, target: string|null}>({title: null, category: null, period: null, period_time: null, target: null});
    const periods = {Mois: 'Month', Semaine: 'Week', Année: 'Year'}

    const [tags, setTags] = useState<string[]>([]);
    const [tagsSearching, setTagsSearching] = useState<string[]>([]);
    const [tagsSelected, setTagsSelected] = useState<string[]>([]);
    const [inputBudgetTag, setInputBudgetTag] = useState({title: '', tag: '', date_start: DateParser.now().toString(), date_end: DateParser.now().toString(), target: 0});
    const [errorValidationBudgetTag, setErrorValidationBudgetTag] = useState<{title: string|null, tags: string|null, date_start: string|null, date_end: string|null, target: string|null}>({title: null, tags: null, date_start: null, date_end: null, target: null});

    const [isModification, setIsModification] = useState(false);
    const [idBudgetSelected, setidBudgetSelected] = useState<string|null>(null);

    function handleChangeCategories(event: any) {
        if (event.target.name === 'category') {
            let categories_found = search_in_array(event.target.value, categories.map(category => category.title));
            setCategoriesSearching(categories.filter(category => categories_found.includes(category.title)));
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
        setInputBudgetCategory({title: '', category: '', period: '', period_time: 0, target: 0});
        setErrorValidationBudgetCategory({title: null, category: null, period: null, period_time: null, target: null});
        setCategoriesSelected([]);
    }

    function handleChangeTags(event: any) {
        if (event.target.name === 'tag') {
            let tags_found = search_in_array(event.target.value, tags);
            setTagsSearching(tags_found);
        }
        setInputBudgetTag({...inputBudgetTag, [event.target.name]: event.target.value});
    }

    function handleSelectTagClick(name: any, value: any) {
        setInputBudgetTag({...inputBudgetTag, [name]: value});
        if (!tagsSelected.includes(value) && !is_empty(value)){
            setTagsSelected([...tagsSelected, value]);
        }
    }
    function removeTagSelected(name: string) {
        let tags = Object.assign([], tagsSelected);
        tags.splice(tags.indexOf(name), 1);
        setTagsSelected(tags);
    }
    function cleanTagInput() {
        setInputBudgetTag({title: '', tag: '', date_start: DateParser.now().toString(), date_end: DateParser.now().toString(), target: 0});
        setErrorValidationBudgetTag({title: null, tags: null, date_start: null, date_end: null, target: null});
        setTagsSelected([]);
    }
    

    async function get_all_Budgets() {
        try {
            const response_budget_category = await axios.get('/api/budget_with_category');
            const budgets_category = response_budget_category.data.budgets;

            const response_budgets_tag = await axios.get('/api/budget_with_tag');
            const budgets_tag = response_budgets_tag.data.budgets;

            for(let i = 0; i < budgets_tag.length; i++ ) {
                budgets_tag[i].date_start = new DateParser(budgets_tag[i].date_start['year'], budgets_tag[i].date_start['month'], budgets_tag[i].date_start['day']);
                budgets_tag[i].date_end = new DateParser(budgets_tag[i].date_end['year'], budgets_tag[i].date_end['month'], budgets_tag[i].date_end['day']); 
            }

            setBudgets([].concat(budgets_category, budgets_tag))

        } catch (error) {
            console.log(error);
        }
    }

    async function get_all_category() {
        try {
            const response_categories = await axios.get('/api/category');
            let categories: Category[] = response_categories.data.categories;
            setCategories(categories)
        } catch(error) {
            console.log(error);
        }
    }

    async function get_all_tags() {
        try {
            const response_categories = await axios.get('/api/tag');
            let tags: string[] = response_categories.data.tags;
            setTags(tags)
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        get_all_Budgets();
        get_all_category();
        get_all_tags();
    }, [])

    function handleOpeningCurrentModal(name: string) {
        setCurrentModal({...currentModal, [name]: true});
    }
    function handleCloseCurrentModal(name: string) {
        setCurrentModal({...currentModal, [name]: false});
        cleanCategoryInput();
        cleanTagInput();
        setIsModification(false);
        setidBudgetSelected(null);
    }

    function handleUpdateBudget(budget: BudgetWithCategoryDisplay|BudgetWithTagDisplay)  {
        setIsModification(true);
        setidBudgetSelected(budget.id);
        if (isBudgetCategory(budget)) {
            setCurrentModal({...currentModal, category: true, tag: false});
            let budget_cat = budget as BudgetWithCategoryDisplay
            let period = Object.entries(periods).find(key => key[1] === budget_cat.period);
            setInputBudgetCategory({
                title: budget_cat.title,
                period: period![0],
                period_time: budget_cat.period_time,
                target: budget_cat.target,
                category: ""
            });
            setCategoriesSelected(budget_cat.categories);
        } else {
            setCurrentModal({...currentModal, tag: true, category: false});
            let budget_tag = budget as BudgetWithTagDisplay;
            setInputBudgetTag({
                title: budget_tag.title,
                date_start: budget_tag.date_start.toString(),
                date_end: budget_tag.date_end.toString(),
                target: budget_tag.target,
                tag: ""
            });
            setTagsSelected(budget_tag.tags);
        }
    }

    async function deleteBudget(id: string, is_category: boolean) {
        try {
            let isOk = confirm('Voulez vous vraiment le supprimer');

            if (isOk) {
                if (is_category) {
                    await axios.delete(`/api/budget_with_category/${id}`);
                } else {
                    await axios.delete(`/api/budget_with_tag/${id}`);
                }
            }
            get_all_Budgets();
            get_all_category();
            get_all_tags();
        } catch(err) {
            console.log(err);
        }
    }


    async function addNewBudgetCategory(is_update: boolean) {
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
                let budget = {
                    title: inputBudgetCategory.title,
                    categories: categoriesSelected.map(cat => cat.id),
                    period: period![1],
                    period_time: inputBudgetCategory.period_time,
                    target: inputBudgetCategory.target
                };

                if (is_update) {
                    await axios.put(`/api/budget_with_category/${idBudgetSelected}`, budget);
                } else {
                    await axios.post(`/api/budget_with_category`, budget);
                }
                
                handleCloseCurrentModal('category');
                get_all_Budgets();
            } else {
                setErrorValidationBudgetCategory(errors)
            }

        } catch(error) {
            console.log(error);
        }
    }

    async function addNewBudgetTag(is_update: boolean) {
        try {
            let do_submit = true;
            let errors = {}
            if (is_empty(inputBudgetTag.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                 errors = {...errors, title: null};
            }

            if (tagsSelected.length == 0) {
                 errors = {...errors, tags: 'Vous devez selection au moins un tag'};
                do_submit = false;
            } else {
                 errors = {...errors, tags: null};
            }

            if (is_empty(inputBudgetTag.date_start)) {
                 errors = {...errors, date_start: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                 errors = {...errors, date_start: null};
            }

            if (is_empty(inputBudgetTag.date_end)) {
                errors = {...errors, date_end: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, date_end: null};
            }

            if (!is_empty(inputBudgetTag.date_start) && !is_empty(inputBudgetTag.date_end)) {
                if (DateParser.from_string(inputBudgetTag.date_start) >= DateParser.from_string(inputBudgetTag.date_end)) {
                    errors = {...errors, date_start: 'La date de depart doit etre inferieur a la date de fin'};
                    do_submit = false;
                } else {
                    errors = {...errors, date_start: null};
                }
            }

            if (inputBudgetTag.target <= 0) {
                errors = {...errors, target: 'Doit etre superieur a 0'};
                do_submit = false;
            } else {
                errors = {...errors, target: null};
            }

            console.log(inputBudgetTag)

            if (do_submit) {
                let budget = {
                    title: inputBudgetTag.title,
                    tags: tagsSelected,
                    date_start: inputBudgetTag.date_start,
                    date_end: inputBudgetTag.date_end,
                    target: inputBudgetTag.target
                } 

                if (is_update) {
                    await axios.put(`/api/budget_with_tag/${idBudgetSelected}`, budget);
                } else {
                    await axios.post(`/api/budget_with_tag`, budget);
                }

                handleCloseCurrentModal('tag');
                get_all_Budgets();
                get_all_tags();
            } else {
                setErrorValidationBudgetTag(errors)
            }

        } catch(error) {
            console.log(error);
        }
    }

    return (
        <>
            <TopNav title='Les budgets'/>
            <div className="budgets">
                <div>
                    <div>                        
                        <Button backgroundColor="white" colorText="#6755D7" title="Ajouter Budget Categorie" onClick={() => handleOpeningCurrentModal('category')}/>
                        <Button backgroundColor="white" colorText="#6755D7" title="Ajouter Budget Tag" onClick={() => handleOpeningCurrentModal('tag')} />
                    </div>
                </div>
                <div className="list">
                    <ListBudget budgets={budgets} onDelete={deleteBudget} onUpdate={handleUpdateBudget} />
                </div>
            </div>
            <Modal isOpen={currentModal.category} onClose={() => {}}>
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
                                <Tag key={key} title={category.title}  onDelete={() => removeCategoriesSelected(category.title)}/>
                            )
                        }
                    </div>
                    <TextInput title="Periode" name="period" type="text" value={inputBudgetCategory.period} onChange={() => {}} options={Object.keys(periods)} onClickOption={handleSelectClickCategoriesModal} error={errorValidationBudgetCategory.period}  overOnBlur={undefined} />
                    <div style={{width: '45%'}}>
                        <TextInput title="Nb Periode" name="period_time" type="number" value={inputBudgetCategory.period_time} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.period_time}  overOnBlur={undefined} />  
                    </div>
                    <div style={{width: '60%'}}>
                        <TextInput title="Cible" name="target" type="number" value={inputBudgetCategory.target} onChange={handleChangeCategories} options={[]} onClickOption={undefined} error={errorValidationBudgetCategory.target}  overOnBlur={undefined} />  
                    </div>
                    <div className="flex justify-center">
                        <Button title={isModification ? "Modifier Budget" : "Creer Budget"} onClick={isModification ?  () => addNewBudgetCategory(true) : () => addNewBudgetCategory(false)} backgroundColor="#6755D7" colorText="white" />
                    </div> 
                </div>
            </Modal>

            <Modal isOpen={currentModal.tag} onClose={() => {}}>
                <div className="add-budget-modal">
                    <div className="add-budget-modal-head flex justify-between">
                        <h3>*</h3>
                        <button onClick={() => handleCloseCurrentModal('tag')} className="close-button">&#x2715;</button>
                    </div>
                    
                    <TextInput title="Nom budget" name="title" type="text" value={inputBudgetTag.title} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetTag.title}  overOnBlur={undefined} />
                    <TextInput title="Tag" name="tag" type="text" value={inputBudgetTag.tag} onChange={handleChangeTags} options={tagsSearching} onClickOption={handleSelectTagClick} error={errorValidationBudgetTag.tags} overOnBlur={() => handleSelectTagClick('tag', inputBudgetTag.tag)} /> 
                    <div className="flex flex-wrap" style={{marginTop: "-12px"}}>
                        {
                            tagsSelected.map((tag: string, key: any) => 
                                <Tag key={key} title={tag}  onDelete={() => removeTagSelected(tag)}/>
                            )
                        }
                    </div>
                    <TextInput title="Date de depart" name="date_start" type="date" value={inputBudgetTag.date_start} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetTag.date_start}  overOnBlur={undefined}/>
                    <TextInput title="Date de fin" name="date_end" type="date" value={inputBudgetTag.date_end} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetTag.date_end}  overOnBlur={undefined} />
                    <div style={{width: '60%'}}>
                        <TextInput title="Cible" name="target" type="number" value={inputBudgetTag.target} onChange={handleChangeTags} options={[]} onClickOption={undefined} error={errorValidationBudgetTag.target}  overOnBlur={undefined} />  
                    </div>
                    <div className="flex justify-center">
                        <Button title={isModification ? "Modifier Budget" : "Creer Budget"} onClick={isModification ? () => addNewBudgetTag(true) : () => addNewBudgetTag(false)} backgroundColor="#6755D7" colorText="white" />
                    </div> 
                </div>
            </Modal>
        </>
    )
}