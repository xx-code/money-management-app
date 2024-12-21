'use client'

import { TagModel } from "@/app/api/models/tag"
import CategoryForm from "@/app/components/forms/categoryForm"
import TagForm from "@/app/components/forms/tagForm/tag"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function TagPage({params: {id}}: { params: {id: string}}) {
    const [tag, setTag] = useState<TagModel>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any|null>(null)
    const router = useRouter()

    const fetchTag = async () => {
        setLoading(true)
        try {
            if (id !== 'new') {
                let response = await axios.get(`/api/tag/${id}`)
                let tag: TagModel = response.data
                setTag(tag)
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
            <TagForm 
                currentTag={tag} 
                onSave={() => router.back()} 
            />
        ) 
    }

    useEffect(() => {
        fetchTag()
    }, [])

    return (
        <div>
            {renderForm()}
        </div>
    )
}