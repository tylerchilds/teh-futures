import {EditorState, EditorView, basicSetup} from "https://esm.sh/@codemirror/basic-setup"
import {javascript} from "https://esm.sh/@codemirror/lang-javascript"

const config = {
  extensions: [basicSetup, javascript()]
}

export default function createEditor(target, flags = {}) {
  const state = EditorState.create({...config, ...flags })

  const view = new EditorView({
    state,
    parent: target
  }) 

  return { state, view }
}

