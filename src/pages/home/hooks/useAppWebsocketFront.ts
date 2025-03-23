import { AppWebsocket } from "@api/websocket/app-websocket";
import { useAppDispatch } from "@store";
import { useEffect, useRef, useState } from "react";
import { setEmbeddedSystemFrontState, setEmbeddedSystemState, setErrorMessage, updateSensorsFrontData } from "../redux";
import { EmbeddedSystemFrontState } from "../constants";

export function useAppWebsocketFront(embeddedSystemFrontIP: string) {
    const dispatch = useAppDispatch();
    const [appWebsocketFront, setAppWebsocketFront] = useState<AppWebsocket>();

    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const createWebsocket = async () => {
        const handleWebsocketMessage = (data: Record<string, any>) => {
            switch (data.type) {
                case "SENSORS_DATA":
                    dispatch(
                        updateSensorsFrontData({
                            data: {
                                hasObject: Number(data["hasObject"]) === 1,
                            },
                        })
                    );
                    break;

                case "SET_STATE":
                    dispatch(
                        setEmbeddedSystemFrontState({
                            embeddedSystemFrontState: data["state"],
                        })
                    );

                    break;

                case "ERROR":
                    dispatch(setErrorMessage({ errorMessage: data["message"] }));
                    break;

                default:
                    break;
            }
        };

        await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000));

        console.log(`Connecting Websocket Front to ${embeddedSystemFrontIP}...`);
        const newAppWebsocketFront = await AppWebsocket.getInstance(
            "EmbeddedSystemFront",
            `ws://${embeddedSystemFrontIP}/ws`,
            (event) => {
                console.log("Connected Front", event);
            },
            (event) => {
                console.log("Message Front", event);
                handleWebsocketMessage(JSON.parse(event.data));
            },
            (event) => {
                console.log("Close Front", event);
                console.log(`Closing Websocket Front to ${embeddedSystemFrontIP}...`);

                dispatch(
                    setEmbeddedSystemFrontState({
                        embeddedSystemFrontState: EmbeddedSystemFrontState.IDLE,
                    })
                );

                setAppWebsocketFront(undefined);
            },
            (event) => {
                console.log("Error", event);
            }
        );

        console.log(newAppWebsocketFront);
        setAppWebsocketFront(newAppWebsocketFront);

        return newAppWebsocketFront;
    };

    useEffect(() => {
        if (appWebsocketFront) return;

        let newAppWebsocketFront: AppWebsocket | undefined = undefined;
        createWebsocket().then((appWebsocketFront) => (newAppWebsocketFront = appWebsocketFront));

        return () => {
            newAppWebsocketFront?.ws.close();
            if (resetTimeoutRef.current) {
                clearTimeout(resetTimeoutRef.current);
                resetTimeoutRef.current = null;
            }
        };
    }, [appWebsocketFront]);

    return appWebsocketFront;
}
