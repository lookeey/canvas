import { writable, type Writable } from "svelte/store";
import { browser } from "$app/env"

let themeSetting: Writable<Theme> = writable("light")
export let resolvedTheme = writable('light')

if (browser) {
  console.log(localStorage.getItem('theme'))
  if (!localStorage.getItem("theme")) {
    localStorage.setItem("theme", "system")
  }

  themeSetting.set(localStorage.getItem("theme") as Theme)

  themeSetting.subscribe(value => {
    localStorage.setItem("theme", value)

    if (value === 'system') {
      resolvedTheme.set(
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      )
    } else {
      resolvedTheme.set(value)
    }
  })
}

export default themeSetting

