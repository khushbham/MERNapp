const initialState = {
     data: { notification_id: "6327f13e4f0aac7a59579e15",
        activation_status: false}
    };

  const buttonReducer = (state = initialState, action) => {
    switch (action.type) {
         case "ON_OFF":
            return{
                ...state,
                data: action.payload
                   
            };
    
            default:
                return state;

    }
}; 
export default buttonReducer
