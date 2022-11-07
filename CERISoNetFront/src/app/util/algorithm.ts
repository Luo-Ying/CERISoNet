export function dateFormat(date: Date) {
    let dateFormated: string = "";
    dateFormated += date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay();
    return dateFormated;
}

export function hourFormat(date: Date) {
    let hourFormated: string = "";
    hourFormated += date.getHours() + ":" + date.getMinutes();
    return hourFormated;
}