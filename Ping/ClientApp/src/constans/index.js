export function formatDate(date) {
    date = new Date(date);
    const month = ['Ocak', 'Þubat', 'Mart', 'Nisan', 'Mayýs', 'Haziran', 'Temmuz', 'Aðustos', 'Eylül', 'Ekim', 'Kasým', 'Aralik'];
    return (date.getDate().toString() + " " + month[date.getMonth()] + " " + date.getFullYear() + "-" + date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds());
}