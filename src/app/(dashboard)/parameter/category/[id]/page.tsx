'use client'

import { CategoryModel } from "@/app/api/models/categories"
import CategoryForm from "@/app/components/forms/categoryForm"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CategoryPage({params: {id}}: { params: {id: string}}) {
    const [category, setCategory] = useState<CategoryModel>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any|null>(null)
    const router = useRouter()

    const fetchCategory = async () => {
        setLoading(true)
        try {
            if (id !== 'new') {
                let response = await axios.get(`/api/category/${id}`)
                let category: CategoryModel = response.data
                setCategory(category)
            }
        } catch(error: any) {
            if (error.response) {
                setError(error.response.data)
            } else if (error.request) {
                setError(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setError(unknowError)
            }
        }
        setLoading(false)
    }

    const renderForm = () => {
        if(loading) {
            return <div>Loading...</div>
        }

        if (error) {
            return <div>{error}</div>
        }

        return (
            <CategoryForm 
                currentCategory={category} 
                onSave={() => router.back()} 
            />
        ) 
    }

    useEffect(() => {
        fetchCategory()
    }, [])

    return (
        <div>
            {renderForm()}
        </div>
    )
}