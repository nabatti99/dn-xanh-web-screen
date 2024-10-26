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
import { EmbeddedSystemState, WasteType } from "./constants";
import { BigQr } from "./components/big-qr";

enum MessageKey {
    DOOR_OPENED = "DOOR_OPENED",
    PROCESSING = "PROCESSING",
}

const messageMap = {
    [MessageKey.DOOR_OPENED]: "Hãy phân loại rác đúng cách!",
    [MessageKey.PROCESSING]: "Đang xử lý...Bạn chờ chút nhé!",
};

export const HomePage = ({}: HomePageProps) => {
    const homeState = useAppSelector((state) => state.home);

    const [messageKey, setMessageKey] = useState<MessageKey>();
    const [qrMessage, setQrMessage] = useState<string>();

    useEffect(() => {
        let newMessageKey: MessageKey | undefined = undefined;
        let newQrMessage: string | undefined = undefined;

        Object.values(homeState).forEach((state) => {
            switch (state.embeddedSystemState) {
                case EmbeddedSystemState.OPENING_DOOR:
                    newMessageKey = MessageKey.DOOR_OPENED;
                    break;

                case EmbeddedSystemState.COLLECTING_DATA:
                case EmbeddedSystemState.SERVER_PROCESSING:
                    newMessageKey = MessageKey.PROCESSING;
                    break;

                case EmbeddedSystemState.CLAIM_REWARD:
                    newQrMessage = "dQw4w9WgXcQ";
                    break;

                default:
                    break;
            }
        });

        setMessageKey(newMessageKey);
        setQrMessage(newQrMessage);
    }, [homeState]);

    return (
        <>
            <Flex position="relative" direction="column" overflow="hidden" width="100%" height="100%">
                <Image src="https://houserentaldanang.com/wp-content/uploads/2023/09/How-to-Get-to-Danang-from-Singapore-1240x720.jpg" alt="bg" className={styles["bg-image"]} />
                <Box className={styles["overlay"]} />

                <Box asChild className={styles["video"]}>
                    <video autoPlay loop muted className={styles["video"]}>
                        <source src="/bg-video.mp4" type="video/mp4" />
                    </video>
                </Box>

                <Flex justify="center" gap="8" className={styles["status-bar-container"]}>
                    <StatusBar wasteType={WasteType.RECYCLABLE} embeddedSystemIP="192.168.137.20" />
                    <StatusBar wasteType={WasteType.ORGANIC} embeddedSystemIP="192.168.137.20" />
                    <StatusBar wasteType={WasteType.NON_RECYCLABLE} embeddedSystemIP="192.168.137.20" />
                </Flex>

                {messageKey && <BigMessage position="absolute" top="0" left="0" message={messageMap[messageKey]} onFinish={() => setMessageKey(undefined)} />}
                {/* {qrMessage && <BigQr position="absolute" top="0" left="0" qrMessage={qrMessage} />} */}
                <BigQr position="absolute" top="0" left="0" qrMessage={"12312312"} />
            </Flex>

            <Seo title="Home" />
        </>
    );
};

// Using for lazy loading page
export default HomePage;
