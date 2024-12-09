import axios from "axios"
import { useEffect, useState } from "react"

export default function useApiFetching(url: string) {
    const [data, setData] = useState<any|null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<any|null>(null)

    const fetch = async () => {
        try {
            setLoading(true)
            const response = await axios.get(url)
            setData(response.data)
        } catch(error: any) {
            if (error.response) {
                setError(error.response.data)
            } else if (error.request) {
                setError(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setError(unknowError)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch()
    }, [url])
    
    return {data, loading, error}
}