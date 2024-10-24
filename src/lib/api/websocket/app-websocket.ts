export class AppWebsocket {
    public ws: WebSocket;
    public static listWs: Record<string, WebSocket> = {};

    constructor(
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

        AppWebsocket.listWs[id] = this.ws;
    }

    public static cleanUp() {
        for (const id in AppWebsocket.listWs) {
            AppWebsocket.listWs[id].close();
            delete AppWebsocket.listWs[id];
        }
    }
}
