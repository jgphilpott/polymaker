import {exportSTL} from "./stl.mjs"
import {exportOBJ} from "./obj.mjs"

export function addEvents() {

  $("body").keypress(function(event) {

    // Ctrl + Enter
    if (event.ctrlKey && event.keyCode == 10) {

      exportSTL()

    // Shift + Enter
    } else if (event.shiftKey && event.keyCode == 13) {

      exportOBJ()

    }

  })

}