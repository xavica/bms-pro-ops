export class PaginateValueConverter {
    appSettings : any;
    toView(array, page = 1, perPage = 10) {
        if (!array) {
            return array;
        }
        const paginationObject = paginate(array, page, perPage);

        return paginationObject.items;
    }
}

const paginate = (items, page = 1, perPage = 10) => {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);

    return {
        previousPage: page - 1 ? page - 1 : null,
        nextPage: (totalPages > page) ? page + 1 : null,
        total: items.length,
        totalPages: totalPages,
        items: paginatedItems
    };
};
