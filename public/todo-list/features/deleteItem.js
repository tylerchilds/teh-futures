// a helper function to remove an item from the items state
export default function deleteItem($, item) {
  // a helper function for filtering the current item out of the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items.filter((item) => {
          if(item.id !== payload.id) {
            return item
          }
        })
      ]
    }
  }

  // remove the item from the item state
  $.set(item, handler)
}
