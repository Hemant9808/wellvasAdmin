export const getUser=()=>{
    const user = localStorage.getItem('authStorage');
    if (user) {
        return JSON.parse(user);
    }   
    return null;
}
