const initialState = {
  loading: false,
  data: [],
  error: "",
};

const teachReducer = (state = initialState, action) => {
  switch (action.type) {
       case "TEACHER_NOTIFICATION":
          return{
              ...state,
              data: action.payload
          };
          default:
              return state;

  }
}; 
export default  teachReducer
  