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
const publish = upload.bind(null, 'save')

export default function createEditor(selector, flags = {}) {
  const $ = tag(selector)

  mount($, flags)
  onAutosave($, { every: 5 })
  onPublish($, flags)
  onRecover($, flags)
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
      // already initialized, quit
      if(editors[target.id]) return

			target.innerHTML = `
				<nav class="action-bar">
					<button data-recover data-id="${target.id}">
						Recover
					</button>
					<button data-publish data-id="${target.id}">
						Publish
					</button>
				</nav>
			`

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

			if(!copy.value) {
				recover(target.id, $)
			}
    })
  })
}

function onAutosave($, { every }) {
  setInterval(() => each($, (target) => {
		autosave(target.id, $)
	}), every * 1000)
}

function onPublish($, _flags) {
	$.on('click', '[data-publish]', (event) => {
		const { id } = event.target.dataset
		publish(id, $)
	})
}

function onRecover($, _flags) {
	$.on('click', '[data-recover]', (event) => {
		const { id } = event.target.dataset
		recover(id, $)
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

async function recover(pathname, $) {
	const value = await fetch(`/public/${pathname}`)
		.then(res => res.text())

	const { view } = editors[pathname]

	view.dispatch({
		changes: {
			from: 0,
			to: view.state.doc.toString().length,
			insert: value
		}
	})
}

function each($, save) {
  return [...document.querySelectorAll($.selector)].map(save)
}
