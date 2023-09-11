const paging = (data, page, limit) => {
  if (!data.length) {
    return {
      results: data,
      page: 0,
      total_pages: 0,
    };
  }
  // results per page = limit
  const results = data.slice(limit * (page - 1), limit * page);

  //total page
  const totalPage = Math.ceil(data.length / limit);

  if (page > totalPage) {
    return {
      errorMessage: `Your page request is over limit total ${totalPage} pages. Please change params and try again!`,
    };
  }

  return {
    results: results,
    page: page,
    total_pages: totalPage,
  };
};

module.exports = paging;
