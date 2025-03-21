export class AppWebsocket {
    public ws: WebSocket;
    public static listAppWs: Record<string, AppWebsocket> = {};

    private constructor(
        id: string,
        url: string,
        onOpen: (event: Event) => void,
        onMessage: (event: MessageEvent) => void,
        onClose: (event: CloseEvent) => void,
        onError: (event: Event) => void
    ) {
        this.ws = new WebSocket(url);
        this.ws.onopen = onOpen;
        this.ws.onmessage = onMessage;
        this.ws.onclose = onClose;
        this.ws.onerror = onError;

        AppWebsocket.listAppWs[id] = this;
    }

    public static getInstance(
        id: string,
        url: string,
        onOpen: (event: Event) => void,
        onMessage: (event: MessageEvent) => void,
        onClose: (event: CloseEvent) => void,
        onError: (event: Event) => void
    ) {
        if (AppWebsocket.listAppWs[id]) {
            const websocket = AppWebsocket.listAppWs[id].ws;
            if (([WebSocket.CONNECTING, WebSocket.OPEN] as number[]).includes(websocket.readyState)) {
                return AppWebsocket.listAppWs[id];
            }
        }

        return new AppWebsocket(id, url, onOpen, onMessage, onClose, onError);
    }

    public static cleanUp() {
        for (const id in AppWebsocket.listAppWs) {
            AppWebsocket.listAppWs[id].ws.close();
            delete AppWebsocket.listAppWs[id];
        }
    }
}
