import { AppWebsocket } from "@api/websocket/app-websocket";
import { Seo } from "@global/components";
import { Flex, Text } from "@radix-ui/themes";
import { useEffect, useRef } from "react";

export const TestPage = ({}) => {
    const appWebsocketRef = useRef<AppWebsocket>();

    useEffect(() => {
        function connectWebsocket() {
            AppWebsocket.getInstance(
                "Test",
                `ws://192.168.137.100/ws`,
                (event) => {
                    console.log("Connected Front", event);
                },
                (event) => {
                    console.log("Message Front", event);
                },
                (event) => {
                    console.log("Close Front", event);
                },
                (event) => {
                    console.log("Error", event);
                }
            ).then((appWebsocket) => {
                appWebsocketRef.current = appWebsocket;
            });
        }

        const intevalId = setInterval(() => {
            const appWebsocket = appWebsocketRef.current;
            console.log(appWebsocket?.ws.readyState);
            
            if (!appWebsocket || appWebsocket.ws.readyState === WebSocket.CLOSED) {
                console.log("WebSocket is closed. Attempting to reconnect...");
                connectWebsocket();
            }
        }, 5000);

        return () => {
            clearInterval(intevalId);
        };
    }, []);

    return (
        <>
            <Flex position="relative" direction="column" overflow="hidden" width="100%" height="100%">
                <Text>Test Page</Text>
            </Flex>

            <Seo title="Test" />
        </>
    );
};

// Using for lazy loading page
export default TestPage;
