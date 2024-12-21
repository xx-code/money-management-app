import { CategoryModel } from "@/app/api/models/categories"
import { TagModel } from "@/app/api/models/tag"
import axios from "axios"
import { useState } from "react"

export function useCategories() {
    const [categories, setCategories] = useState<CategoryModel[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setErrorCategories] = useState<any|null>(null)

    const fetchCategories = async () => {
        setLoading(true)
        try {
            let response = await axios.get('/api/category')
            let data = response.data
            setCategories(data)
        } catch(err: any) {
            if (error.response) {
                setErrorCategories(error.response.data)
            } else if (error.request) {
                setErrorCategories(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setErrorCategories(unknowError)
            }
        }
        setLoading(false)
    }

    return {categories, loading, error, fetchCategories}
}

export function useTags() {
    const [tags, setTags] = useState<TagModel[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setErrorTags] = useState<any|null>(null)

    const fetchTags = async () => {
        setLoading(true)
        try {
            let response = await axios.get('/api/tag')
            let data = response.data
            setTags(data)
        } catch(err: any) {
            if (error.response) {
                setErrorTags(error.response.data)
            } else if (error.request) {
                setErrorTags(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setErrorTags(unknowError)
            }
        }
        setLoading(false)
    }

    return {tags, loading, error, fetchTags}
}