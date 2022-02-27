const now = new Date()

const addMinWithNow = (total) => now.setHours(now.getMinutes() + total)
const addDateWithNow = (total) => now.setDate(now.getDate() + total)
const compareDateNow = (date) => now.getTime() === date.getTime() ? 1 : now.getTime() < date.getTime() ? 2 : 0
const getTimeNow = () => now.getTime()

module.exports = {
    addMinWithNow,
    compareDateNow,
    addDateWithNow,
    getTimeNow
}