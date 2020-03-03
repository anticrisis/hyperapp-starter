import { request } from '@hyperapp/http'
import { State } from './state'

// Wraps an action to process a response from server
const handler = (action: (s: State, data: object) => any) =>
    (state: State, response: any) => {

        // for error handling, capture the error and set connected state to
        // false
        const err = (s: State, e: Error): State =>
            ({
                ...s, connectionStatus: {
                    ...s.connectionStatus,
                    connectionError: e,
                    connected: false
                }
            })

        try {
            // check for error
            if (response instanceof Error)
                return err(state, response)

            // For example, parse the JSON response here
            // const res = JSON.parse(response);

            // http-echo-server just gives us HTTP text, so we don't parse it
            const res = response

            // update connection status to remove any prior error object
            // heartbeat() depends on connection_error being set or unset
            // to determine if an error occurred
            const state_ = {
                ...state, connectionStatus: {
                    ...state.connectionStatus, connectionError: undefined
                }
            }
            return action(state_, res)
        }
        catch (e) {
            return action(err(state, e), {})
        }
    }

// Main interface to send an HTTP POST request to a backend API
// This is arbitrary, but the sample protocol is a 'cmd' string and 
// an 'args' object
export const sendRequest = (state: State, cmd: string, args: object,
    action: (s: State, d: object) => any) => {
    const body = JSON.stringify({ ...args, cmd: cmd })
    return request({
        url: state.apiUrl,
        options: {
            method: 'POST',
            mode: 'cors',

            // http-echo-server only accepts text/plain
            headers: { "content-type": "text/plain" },
            body: body
        },
        expect: 'text',

        // provide our handler() filter to post-process the response before
        // passing it on to the action
        action: handler(action)
    })
}

// A heartbeat action that demonstrates the use of send_request
// It is set up in index.ts/subscriptions
export const heartbeat = (s: State, data: object): State =>
    s.connectionStatus.connectionError ?
        {
            ...s, connectionStatus: {
                ...s.connectionStatus, connected: false
            }
        }
        :
        {
            ...s, connectionStatus: {
                ...s.connectionStatus, connected: true,
                lastHeartbeat: new Date()
            }
        }