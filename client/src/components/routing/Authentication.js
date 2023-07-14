export const studentAuth=()=>{
  const user=localStorage.getItem('token')
  const userRole = localStorage.getItem('user_role')
  // console.log(user , userRole , "User Role")
  if(user && userRole == 1){
    return true
  } else {
    return false
  }
};
export const studentprofileAuth=()=>{
  const user=localStorage.getItem('token')
  const userRole = localStorage.getItem('user_role')
  const profile_created = localStorage.getItem('profile_created')
  // console.log(user , userRole , "User Role")
  if(user && userRole == 1 && profile_created){
    return true
  } else {
    return false
  }
};

export const TeacherAuth=()=>{
  const user=localStorage.getItem('token')
  const userRole = localStorage.getItem('user_role')
  
  // console.log(user , userRole , "User Role")
  if(user && userRole == 2){
    return true
  } else {
    return false
  }
};
export const TeacherProfileAuth=()=>{
  const user=localStorage.getItem('token')
  const userRole = localStorage.getItem('user_role')
  const profile_created = localStorage.getItem('profile_created')
  // console.log(user , userRole , "User Role")
  if(user && userRole == 2 && profile_created){
    return true
  } else {
    return false
  }
}