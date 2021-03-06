// adds a click event listener for when the complete all action is performed
// all items will be marked as completed in the items state
export default function onCompletenessToggle($) {
  $.on(
    'change',
    '[data-toggle-all]',
    (event) => handler($, event)
  )
}

function handler($, event) {
  const { checked } = event.target
  const { items } = $.get()
  const markedItems = items.map(x => ({
    ...x,
    completed: checked
  }))

  $.set({ items: markedItems })
}
