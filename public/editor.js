import {
  EditorState,
  EditorView,
  basicSetup
} from "https://esm.sh/@codemirror/basic-setup"
import {
  css
} from "https://esm.sh/@codemirror/lang-css"
import {
  html
} from "https://esm.sh/@codemirror/lang-html"
import {
  javascript
} from "https://esm.sh/@codemirror/lang-javascript"
import tag
  from "https://thelanding.page/tag/tag.js"

const editors = {}

const autosave = upload.bind(null, 'autosave')
const save = upload.bind(null, 'save')

export default function createEditor(selector, flags = {}) {
  const $ = tag(selector)

  mount($, flags)
  onSave($, flags)
  onAutosave($, { every: 5 })
}

const config = {
  extensions: [
    basicSetup,
    html(),
    css(),
    javascript()
  ]
}

function mount($, flags) {
  $.mount(target => {
    $.ready(() => {
      // not ready or already initialized, quit
      if(editors[target.id]) return

      const initialState = $.read()
      const copy = initialState[target.id] || {}

      const state = EditorState.create({
        ...config,
        ...flags,
        doc: copy.value
      })

      const view = new EditorView({
				dispatch: persist(target, $, flags),
        parent: target,
        state
      }) 

      editors[target.id] = {
        $,
        state,
        view,
      }
    })
  })
}

function onAutosave($, { every }) {
  setInterval(() => each($, (target) => {
		autosave(target.id, $)
	}), every * 1000)
}

function onSave($, _flags) {
	$.on('click', '[data-save]', (event) => {
		save(event.target.id, $)
	})
}

async function upload(mode, pathname, $) {
	const currentState = $.read()
	const { value } = currentState[pathname] || {}

	if(value) {
		// persist to some back up location
		const response = await fetch(pathname, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				mode,
				value
			})
		});
		
		console.log(response)
	}
}

function persist(target, $, _flags) {
	return (transaction) => {
		if(transaction.changes.inserted.length < 0) return

		const { id } = target
		const { view } = editors[id]
		const value = view.state.doc.toString()
		view.update([transaction])
		$.write({ [id]: { value }})
	}
}

function each($, save) {
  return [...document.querySelectorAll($.selector)].map(save)
}
