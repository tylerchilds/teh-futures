// a helper function to add an item to the items state
export default function createItem($, task) {
  // build a new item, with a random id for collision-free duplicates
  const item = {
    task,
    completed: false,
    editing: false,
    id: task +  Math.floor((Math.random() * 100) + 1)
  }

  // a helper function for appending an item into the item state
  const handler = (state, payload) => {
    return {
      ...state,
      items: [
        ...state.items,
        payload
      ]
    }
  }

  // add the new item to the items state
  $.set(item, handler)
}
