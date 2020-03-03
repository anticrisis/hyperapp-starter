export interface ConnectionStatus {
    connected: boolean
    lastHeartbeat?: Date
    connectionError?: Error
}

export interface State {
    apiUrl: string
    connectionStatus: ConnectionStatus
    currentView: (s: State) => any
    lastUpdate: number
    thingYouTyped?: string
}

export const initialState = (): State => ({
    apiUrl: "http://localhost:3000/",
    connectionStatus: { connected: false },
    currentView: (s) => null,
    lastUpdate: 0
})
