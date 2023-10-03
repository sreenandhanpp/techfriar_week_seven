export const getItem = (item) => {
    return  JSON.parse(localStorage.getItem(item));
}