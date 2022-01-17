// a helper function to locate an item by an id
export default function findItemById($, id) {
  const { items } = $.get()
  return items.find(x => x.id === id)
}
