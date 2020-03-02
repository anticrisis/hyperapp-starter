import { h, app } from 'hyperapp'
import { interval } from '@hyperapp/time'
import { State, initialState } from './state'
import { main } from './view'
import { heartbeat, sendRequest } from './server';

// initial state value
const init: State = { ...initialState(), currentView: main }

// view function, dispatches to current_view
const view = (s: State) => s.currentView(s);

// subscriptions
const subUpdate = (s: State, d: number) =>
    ({ ...s, lastUpdate: d })

const subHeartbeat = (s: State) =>
    [s, sendRequest(s, 'heartbeat', {}, heartbeat)]

const subscriptions = (s: State) => [
    interval(subUpdate, { delay: 1000 }),
    interval(subHeartbeat, { delay: 5000 })
]

app({
    init: init,
    view: view,
    subscriptions: subscriptions,
    node: document.getElementById("app")
})

