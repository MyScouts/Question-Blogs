require('dotenv').config()

const PORT = process.env.PORT || 5000
const PASSPORT_SECRET = process.env.PASSPORT_SECRET || 'secret'
const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'items',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',

};

const PAGINATE_CONFIG = (page, pageSize) => {
    console.log("🚀 ~ file: config.js ~ line 17 ~ page, pageSize", page, pageSize)
    return { page: parseInt(page), limit: parseInt(pageSize), customLabels: myCustomLabels }
}



module.exports = {
    PAGINATE_CONFIG,
    PORT,
    PASSPORT_SECRET
}