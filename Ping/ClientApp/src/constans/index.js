export function formatDate(date) {
    date = new Date(date);
    const month = ['Ocak', '�ubat', 'Mart', 'Nisan', 'May�s', 'Haziran', 'Temmuz', 'A�ustos', 'Eyl�l', 'Ekim', 'Kas�m', 'Aralik'];
    return (date.getDate().toString() + " " + month[date.getMonth()] + " " + date.getFullYear() + "-" + date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds());
}