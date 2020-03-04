// Glue for a subscription entry that listens to an event and dispatches to an action
// from https://github.com/jorgebucaran/hyperapp/blob/master/docs/src/subscriptions.js

const fx = (a: any) => (b: any) => [a, b]

export const PopState = fx((dispatch: any, props: any) => {
    const handle = () => {
        dispatch([props.action, window.location.pathname + window.location.search])
    }
    addEventListener('popstate', handle)

    // subscriptions return a function that is invoked by hyperapp when the
    // subscription is removed
    return () => {
        removeEventListener('popstate', handle)
    }
})
