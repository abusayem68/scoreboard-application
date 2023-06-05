const createNewId = (arrayOfObject) => {
  const maxId = arrayOfObject.reduce(
    (maxId, item) => Math.max(item.id, maxId),
    0
  );
  return maxId + 1;
};
