import { AppWebsocket } from "@api/websocket/app-websocket";
import { Seo } from "@global/components";
import { Box, Container, Flex, Section, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { HomePageProps } from "./type";
import { BigMessage } from "./components";
import { Icon, Image } from "@components";

import styles from "./style.module.scss";
import { useAppDispatch, useAppSelector } from "@store";
import { setEmbeddedSystemState, updateSensorsData } from "./redux";
import { StatusBar } from "./components/status-bar";
import { WasteType } from "./constants";

export const HomePage = ({}: HomePageProps) => {
    const dispatch = useAppDispatch();
    const { height, isDoorOpened } = useAppSelector((state) => state.home);

    const [appWebsocket, setAppWebsocket] = useState<AppWebsocket>();
    const [message, setMessage] = useState<string>();

    const handleWebsocketMessage = (data: Record<string, any>) => {
        switch (data.type) {
            case "SENSORS_DATA":
                dispatch(
                    updateSensorsData({
                        isDoorOpened: Number(data["isDoorOpened"]) === 1,
                        height: data["height"],
                    })
                );
                break;

            case "SET_STATE":
                dispatch(setEmbeddedSystemState(data["state"]));
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (appWebsocket) return;

        new AppWebsocket(
            "RecycleEmbeddedSystem",
            "ws://192.168.137.153/ws",
            (event) => {
                console.log("Connected", event);
                setMessage("Connected");
            },
            (event) => {
                console.log("Message", event);
                handleWebsocketMessage(JSON.parse(event.data));
            },
            (event) => {
                console.log("Close", event);
                setAppWebsocket(undefined);
            },
            (event) => {
                console.log("Error", event);
            }
        );

        return () => {
            AppWebsocket.cleanUp();
        };
    }, [appWebsocket]);

    const handleMessageFinished = () => {
        setMessage(undefined);
    };

    return (
        <>
            <Flex position="relative" direction="column" overflow="hidden" width="100%" height="100%">
                <Image src="https://houserentaldanang.com/wp-content/uploads/2023/09/How-to-Get-to-Danang-from-Singapore-1240x720.jpg" alt="bg" className={styles["bg-image"]} />
                <Box className={styles["overlay"]} />

                <Flex justify="center" gap="8" className={styles["status-bar-container"]}>
                    <StatusBar wasteType={WasteType.RECYCLABLE} />
                    <StatusBar wasteType={WasteType.ORGANIC} />
                    <StatusBar wasteType={WasteType.NON_RECYCLABLE} />
                </Flex>

                {/* {message && <BigMessage position="absolute" top="0" left="0" message={message} onFinish={handleMessageFinished} />} */}
            </Flex>

            <Seo title="Home" />
        </>
    );
};

// Using for lazy loading page
export default HomePage;
