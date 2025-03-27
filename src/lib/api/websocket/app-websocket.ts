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

    public static async getInstance(
        id: string,
        url: string,
        onOpen: (event: Event) => void,
        onMessage: (event: MessageEvent) => void,
        onClose: (event: CloseEvent) => void,
        onError: (event: Event) => void
    ) {
        if (AppWebsocket.listAppWs[id]) {
            const websocket = AppWebsocket.listAppWs[id].ws;

            switch (websocket.readyState) {
                case WebSocket.CLOSED:
                    delete AppWebsocket.listAppWs[id];
                    break;

                case WebSocket.CLOSING:
                    await new Promise((resolve) => {
                        let closingIntervalId: NodeJS.Timeout | null = null;
                        closingIntervalId = setInterval(() => {
                            if (websocket.readyState === WebSocket.CLOSED) {
                                clearInterval(closingIntervalId!);
                                resolve(true);
                            }
                        }, 1000);
                    });
                    delete AppWebsocket.listAppWs[id];
                    break;
                    // return AppWebsocket.listAppWs[id];

                case WebSocket.CONNECTING:
                    await new Promise((resolve) => {
                        let openingIntervalId: NodeJS.Timeout | null = null;
                        openingIntervalId = setInterval(() => {
                            if (websocket.readyState === WebSocket.OPEN) {
                                clearInterval(openingIntervalId!);
                                resolve(true);
                            }
                        }, 1000);
                    });
                    return AppWebsocket.listAppWs[id];

                case WebSocket.OPEN:
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
