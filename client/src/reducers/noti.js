const initialState = {
    loading: false,
    users: [],
    error: "",
  };

  const userReducer = (state = initialState, action) => {
    switch (action.type) {
         case "FAKER":
            return{
                ...state,
                users: action.payload
            };
            default:
                return state;

    }
}; 
export default userReducer
    