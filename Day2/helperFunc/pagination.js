export function paginateData(query, data) {
  const {page = 1, limit = 20} = query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;
  return {
    employees: data.slice(startIndex, endIndex),
    total: data.length,
    page: pageNum,
    limit: limitNum
  };
}
