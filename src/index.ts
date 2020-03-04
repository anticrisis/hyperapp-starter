import { h, app } from 'hyperapp'
import { interval } from '@hyperapp/time'
import { State, initialState } from './state'
import { PopState } from './events'
import { main, handlePopState } from './view'
import { heartbeat, sendRequest } from './server';

// initial state value
const init: State = handlePopState({ ...initialState() }, window.location.pathname)

// view function, dispatches to current_view
const view = (s: State) => s.currentView(s);

// subscriptions
const subUpdate = (s: State, d: number) =>
    ({ ...s, lastUpdate: d })

const subHeartbeat = (s: State) =>
    [s, sendRequest(s, 'heartbeat', {}, heartbeat)]

const subscriptions = (s: State) => {
    return [
        interval(subUpdate, { delay: 1000 }),
        interval(subHeartbeat, { delay: 5000 }),
        PopState({ action: handlePopState }),
    ]
}

app({
    init: init,
    view: view,
    subscriptions: subscriptions,
    node: document.getElementById("app")
})

