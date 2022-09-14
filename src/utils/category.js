export const filterCategoryTreeDataByProperty = (tree, property, value) => {
  return tree.filter(cat => {
    if (cat.children && cat.children.length) {
      cat.children = filterCategoryTreeDataByProperty(cat.children, property, value);
    }
    return !!(cat[property]) === !!value;
  });
};
