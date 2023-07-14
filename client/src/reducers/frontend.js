import {
 STUDENT_SIGNUP_SUCCESS   
} from "../actions/types"


const initialState = {};
const frontend = (state = initialState , action) => {
    const {type , payload} = action;

    switch (type) {
        case STUDENT_SIGNUP_SUCCESS:
            return{
                ...state,
                user:payload
            }    
        default:
            return state;
    }
}



export default frontend