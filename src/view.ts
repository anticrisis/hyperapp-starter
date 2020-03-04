import { h } from 'hyperapp'
import { State } from './state'
import { sendRequest } from './server'
import { preventDefault, stopPropagation } from '@hyperapp/events'


// An action to handle a response from backend api
const gotStatus = (s: State, res: object) => {
    console.log("got status: " + JSON.stringify(res))
    return s
}

// An action for user-triggered backend api request
const getStatus = (s: State) => [
    s, sendRequest(s, 'status', {}, gotStatus)
]

// ---
// Routing
// ---

// When user clicks on a button to change view, push the state to window via
// History API
const changeView = (s: State, view: (s: State) => any, path: string): (s: State) => any =>
    ((s: State) => {
        window.history.pushState({}, "", path)
        return { ...s, currentView: view }
    })

// Handle user clicking back/forward button, which triggers the popState event
export const handlePopState = (s: State, path: string) => {
    // map the desired path to a view function
    var view = null;

    // trim trailing / if any
    if (path.endsWith("/")) {
        path = path.substring(0, path.length - 1)
    }

    switch (path) {
        case "/":
            view = main;
            break
        case "/connection":
            view = connection
            break
        case "/form":
            view = form
            break;
        default:
            view = main;
            break;
    }

    return { ...s, currentView: view }
}

// The navigation menu
const mainMenu = (s: State): any =>
    h("div", { id: "menu" }, [
        h("button", { onclick: changeView(s, main, "/") }, "home"),
        h("button", { onclick: changeView(s, connection, "/connection") }, "connection"),
        h("button", { onclick: changeView(s, form, "/form") }, "form"),
    ])

// The connection screen
const connection = (s: State) =>
    h("div", {}, [
        mainMenu(s),
        h("h1", {}, "Connection"),
        h("p", {}, `Connection status: ${s.connectionStatus.connected}`),
        h("p", {}, `Last heartbeat: ` +
            (s.connectionStatus.lastHeartbeat ?
                `${Math.floor((Date.now() - s.connectionStatus.lastHeartbeat.valueOf()) / 1000)}s ago`
                :
                "never"
            )),
        s.connectionStatus.connectionError && h("p", {}, `Connection error: ${s.connectionStatus.connectionError} `),
        h("button", { onclick: getStatus }, "status"),
        h("div", { id: "info" }, [
            h("p", {}, ["API URL: ", h("code", {}, s.apiUrl)]),
            h("p", {}, "State:"),
            h("pre", {}, JSON.stringify(s))
        ])
    ])

// handle form submission
const formSubmit = (s: State, e: any) => {
    const inp = e?.target?.elements?.namedItem('thing')
    if (inp) {
        return { ...s, thingYouTyped: inp.value }
    }
    return s
}

// The Form view
export const form = (s: State) =>
    h("div", {}, [
        mainMenu(s),
        h("h1", {}, "Form"),
        h("div", {}, [
            h("form", { onsubmit: preventDefault(formSubmit) }, [
                h("label", { for: 'thing' }, 'Say a thing:'),
                h("input", { type: 'text', name: 'thing' }),
                h("input", { type: 'submit' }, "submit")
            ])
        ]),
        h("div", {}, [
            h("h2", {}, "Thing you typed:"),
            h("pre", {}, s.thingYouTyped)
        ])
    ])

// The home screen
export const main = (s: State) =>
    h("div", { id: "app" }, [
        mainMenu(s),
        h("h1", {}, "Home"),
        h("p", {}, "Use the navigation buttons at the top of the page.")
    ])
