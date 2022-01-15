import {EditorState, EditorView, basicSetup} from "@codemirror/basic-setup"
import {javascript} from "@codemirror/lang-javascript"

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
