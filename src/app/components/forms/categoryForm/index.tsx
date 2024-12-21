'use client'

import TextInput from "@/app/components/textInput"
import { useReducer, useState } from "react"
import Button from "@/app/components/button"
import { isEmpty } from "@/core/domains/helpers"
import axios from "axios"
import { CategoryModel } from "@/app/api/models/categories"
import { RequestCreationCategoryUseCase } from "@/core/interactions/category/creationCategoryUseCase"
import { RequestUpdateCategoryUseCase } from "@/core/interactions/category/updateCategoryUseCase"

type CategoryInput = {
    id: string
    title: string,
    color: string
    icon: string
}

let initCategoryInput: CategoryInput =  {
    id: "",
    title: "",
    color: "",
    icon: ""
}

function createCategoryInputInitial(category: CategoryModel|undefined): CategoryInput {
    if (category) {
        return {
            id: category.categoryId,
            title: category.title,
            color: category.color ? category.color : "",
            icon: category.icon
        }
    }

    return initCategoryInput
}

type CategoryInputError = {
    title: string
    color: string
    icon: string
}

const initCategoryInputError: CategoryInputError = {
    title: "",
    color:"",
    icon: ""
}

const verifyInput = (input: CategoryInput): {isOk: boolean, errors: CategoryInputError} => {
    let isOk = true;
    let errors: CategoryInputError = initCategoryInputError

    if (isEmpty(input.title)) {
        errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
        isOk = false;
    } 

    if (isEmpty(input.icon)) {
        errors = {...errors, icon: 'Ce champs ne doit pas etre vide'}
        isOk = false
    } 

    return {
        isOk: isOk,
        errors: errors
    }
}

type ActionReducer = {
    type: string
    field: string
    value: any
}

function reducer(state: CategoryInput, action: ActionReducer): any {
    
    if (action.type === 'update_field') {
        return {
            ...state,
            [action.field]: action.value
        }
    }

    return state
}

type Props = {
    currentCategory: undefined|CategoryModel,
    onSave: () => void
}

export default function CategoryForm({currentCategory, onSave}: Props) {
    const [input, dispatch] = useReducer(reducer, currentCategory, createCategoryInputInitial)
    const [error, setError] = useState<CategoryInputError>(initCategoryInputError) 

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: 'update_field',
            field: e.target.name,
            value: e.target.value
        })
    }

    async function save() {
        try {
            let {isOk, errors} = verifyInput(input)
            setError(errors)
            if (isOk) {
                let request: RequestCreationCategoryUseCase = {
                    title: input.title,
                    icon: input, 
                    color: input.col
                }

                await axios.post(`/api/category`, request);

                onSave()
            } 
        } catch(error: any) {
            console.log(error);

            
        }
    }

    async function update() {
        try {
            let {isOk, errors} = verifyInput(input)
            setError(errors)
            if (isOk) {
                let request: RequestUpdateCategoryUseCase = {
                    id: input.id,
                    title: input.title,
                    icon: input.icon,
                    color: input.color
                }
                await axios.put(`/api/category/${currentCategory!.categoryId}`, request);

                onSave()
            }
        } catch(error: any) {
            console.log(error)
        }
    }

    return (
        <div className="add-budget-modal">        
            <TextInput 
                title="Description" 
                name="title" 
                type="text" 
                value={input.title} 
                onChange={handleInput} 
                error={error.title} 
            />
            <TextInput 
                title="Icon" 
                name="icon" 
                type="text" 
                value={input.icon} 
                onChange={handleInput} 
                error={error.icon} 
            />
            <TextInput 
                title="Couleur" 
                name="color" 
                type="text" 
                value={input.color} 
                onChange={handleInput} 
                error={error.color} 
            />
            
            <div className="flex justify-center">
                <Button 
                    title={currentCategory ? "Modifier Categorie" : "Creer Categorie"} 
                    onClick={currentCategory ? update: save} 
                    backgroundColor="#6755D7" 
                    colorText="white" 
                />
            </div> 
        </div>
    )
}