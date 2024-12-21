'use client'

import TextInput from "@/app/components/textInput"
import { useReducer, useState } from "react"
import Button from "@/app/components/button"
import { isEmpty } from "@/core/domains/helpers"
import axios from "axios"
import { TagModel } from "@/app/api/models/tag"
import { RequestCreationTagUseCase } from "@/core/interactions/tag/creationTagUseCase"
import { RequestUpdateTagUseCase } from "@/core/interactions/tag/updateTagUseCase"

type TagInput = {
    id: string
    title: string,
    color: string
}

let initTagInput: TagInput =  {
    id: "",
    title: "",
    color: "",
}

function createTagInputInitial(Tag: TagModel|undefined): TagInput {
    if (Tag) {
        return {
            id: Tag.tagId,
            title: Tag.title,
            color: Tag.color ? Tag.color : ""
        }
    }

    return initTagInput
}

type TagInputError = {
    title: string
    color: string
}

const initTagInputError: TagInputError = {
    title: "",
    color:"",
}

const verifyInput = (input: TagInput): {isOk: boolean, errors: TagInputError} => {
    let isOk = true;
    let errors: TagInputError = initTagInputError

    if (isEmpty(input.title)) {
        errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
        isOk = false;
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

function reducer(state: TagInput, action: ActionReducer): any {
    
    if (action.type === 'update_field') {
        return {
            ...state,
            [action.field]: action.value
        }
    }

    return state
}

type Props = {
    currentTag: undefined|TagModel,
    onSave: () => void
}

export default function TagForm({currentTag, onSave}: Props) {
    const [input, dispatch] = useReducer(reducer, currentTag, createTagInputInitial)
    const [error, setError] = useState<TagInputError>(initTagInputError) 

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
                let request: RequestCreationTagUseCase = {
                    value: input.title,
                    color: input.color
                }

                await axios.post(`/api/tag`, request);

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
                let request: RequestUpdateTagUseCase = {
                    id: input.id,
                    value: input.title,
                    color: input.color
                }
                await axios.put(`/api/tag/${currentTag!.tagId}`, request);

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
                title="Couleur" 
                name="color" 
                type="text" 
                value={input.color} 
                onChange={handleInput} 
                error={error.color} 
            />
            
            <div className="flex justify-center">
                <Button 
                    title={currentTag ? "Modifier Tag" : "Creer Tag"} 
                    onClick={currentTag ? update: save} 
                    backgroundColor="#6755D7" 
                    colorText="white" 
                />
            </div> 
        </div>
    )
}