import {EditorState, EditorView, basicSetup} from "https://esm.sh/@codemirror/basic-setup"
import {javascript} from "https://esm.sh/@codemirror/lang-javascript"

function createEditor(target) {
  const editor = new EditorView({
    state: EditorState.create({
      extensions: [basicSetup, javascript()]
    }),
    parent: target
  }) 

  return editor
}

createEditor(document.body)
