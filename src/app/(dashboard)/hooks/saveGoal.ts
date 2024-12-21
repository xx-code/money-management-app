import { SaveGoalModel } from "@/app/api/models/save-goal";
import axios from "axios";
import { useState } from "react";

export function useSaveGoals() {
    const [saveGoals, setSaveGoals] = useState<SaveGoalModel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any|null>(null)
    
    const fetchSaveGoal = async () => {
        setLoading(true)
        try {
            let response = await axios.get('/api/save-goal')
            let saveGoalRes: SaveGoalModel[] = response.data
            setSaveGoals(saveGoalRes)
        } catch(err) {
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

    return { saveGoals, loading, error, fetchSaveGoal }
}