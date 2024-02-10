export class PromotionPaginateValueConverter {
    appSettings: any;
    toView(array, page = 1, perPage = 20) {
        if (!array) {
            return array;
        }
        const paginationObject = promotionPaginate(array, page, perPage);

        return paginationObject.items;
    }
}

const promotionPaginate = (items, page = 1, perPage = 20) => {
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
