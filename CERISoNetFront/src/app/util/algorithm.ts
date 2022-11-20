export function dateFormat(date: Date) {
    let dateFormated: string = "";
    // console.log(date.toLocaleDateString());
    const strDateLocal = date.toLocaleDateString();
    const wordsDate = strDateLocal.split('/');
    dateFormated += wordsDate[2] + "-" + wordsDate[1] + "-" + wordsDate[0];
    return dateFormated;
}

export function hourFormat(date: Date) {
    let hourFormated: string = "";
    // hourFormated += date.getHours() + ":" + date.getMinutes();
    // console.log(date.toLocaleTimeString());
    const strTimeLocal = date.toLocaleTimeString();
    const wordsTime = strTimeLocal.split(':');
    hourFormated += wordsTime[0] + ":" + wordsTime[1];
    return hourFormated;
}

export function transferDateToTimestamp(date: string) {
    let datum = Date.parse(date);
    return datum / 1000;
}