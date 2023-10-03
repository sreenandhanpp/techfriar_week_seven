export const setItem = (item,data) =>   {
    localStorage.setItem(item,JSON.stringify(data));
}