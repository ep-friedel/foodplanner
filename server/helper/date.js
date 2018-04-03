const second = 1000,
    minute = 60 * second,
    hour = 60 * minute,
    day = 24 * hour,
    week = 7 * day,
    year = 365 * day,
    tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

function fill(val, n) {
    return ('0'.repeat(n) + val).slice(-n);
}

const formatDate = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${src.getDate()}.${src.getMonth() + 1}.${src.getFullYear().toString().slice(2,4)}`;
}

const formatTime = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}

const formatDateTime = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date);

    return `${src.getDate()}.${src.getMonth() + 1}.${src.getFullYear().toString().slice(2,4)} - ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}
const formatTimeShort = (date) => {
    const src = new Date((date.toString().length === 10) ? (date * 1000) : date),
        diff = Date.now() - ((date.toString().length === 10) ? (date * 1000) : date);

    if (diff < -week) {
        `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    } else if (diff < -day) {
        return `${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    } else if (diff < -2 * hour) {
        return `in ${-Math.floor(diff / hour)} Stunden`;
    } else if (diff < -hour) {
        return `in 1 Stunde`;
    } else if (diff < -minute) {
        return `in ${-Math.floor(diff / minute)} Minuten`;
    } else if (diff < 0) {
        return `in 1 Minute`;
    } else if (diff < 2 * minute) {
        return `vor 1 Minute`;
    } else if (diff < hour) {
        return `vor ${Math.floor(diff / minute)} Minuten`;
    } else if (diff < 2 * hour) {
        return `vor 1 Stunde`;
    } else if (diff < day) {
        return `vor ${Math.floor(diff / hour)} Stunden`;
    } else if (diff < week) {
        return `letzten ${tage[src.getDay()]}, ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
    }
    return `${src.getDate()}.${src.getMonth() + 1}${(diff < year) ? '' : ('.' + src.getFullYear())} ${fill(src.getHours(), 2)}:${fill(src.getMinutes(), 2)}`;
}

const round = (date, duration) => {
    return new Date(Math.ceil((+date) / (+duration * 1000)) * (+duration * 1000));
}

module.exports = {
    formatDate,
    formatTime,
    formatDateTime,
    formatTimeShort,
    round
}