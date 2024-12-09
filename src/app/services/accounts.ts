import axios from "axios";
import { ApiGetAllAccountResponse } from "../api/account/route";

class AccountService {

    async getAllAcount() {
        let res = await axios.get('/api/account')
        let data: ApiGetAllAccountResponse[] = res.data

        return data
    }
}