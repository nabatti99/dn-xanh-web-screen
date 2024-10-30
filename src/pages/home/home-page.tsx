import { Image } from "@components";
import { Seo } from "@global/components";
import { Box, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { BigMessage } from "./components";
import { HomePageProps } from "./type";
import { useAppDispatch, useAppSelector } from "@store";
import { BigQr } from "./components/big-qr";
import { StatusBar } from "./components/status-bar";
import { EmbeddedSystemState, WasteType } from "./constants";

import styles from "./style.module.scss";
import { ErrorMessage } from "./components/error-message";
import { setErrorMessage } from "./redux";

enum MessageKey {
    DOOR_OPENED = "DOOR_OPENED",
    PROCESSING = "PROCESSING",
    FINISHING = "FINISHING",
}

const defaultMessageFinishing = "Cảm ơn {userName} đã phân loại rác!";
const messageMap = {
    [MessageKey.DOOR_OPENED]: "Hãy phân loại rác đúng cách!",
    [MessageKey.PROCESSING]: "Đang xử lý...Bạn chờ chút nhé!",
    [MessageKey.FINISHING]: defaultMessageFinishing
};

export const HomePage = ({}: HomePageProps) => {
    const dispatch = useAppDispatch();
    const { embeddedSystemData, qrData, errorMessage, classifyByUserName } = useAppSelector((state) => state.home);


    const [messageKey, setMessageKey] = useState<MessageKey>();
    const [qrMessage, setQrMessage] = useState<string>();

    useEffect(() => {
        let newMessageKey: MessageKey | undefined = undefined;
        let newQrMessage: string | undefined = undefined;

        Object.values(embeddedSystemData).forEach((state) => {
            switch (state.embeddedSystemState) {
                case EmbeddedSystemState.OPENING_DOOR:
                    newMessageKey = MessageKey.DOOR_OPENED;
                    break;

                case EmbeddedSystemState.COLLECTING_DATA:
                case EmbeddedSystemState.SERVER_PROCESSING:
                    newMessageKey = MessageKey.PROCESSING;
                    break;

                case EmbeddedSystemState.CLAIM_REWARD:
                    if (qrData) {
                        if (qrData.isCorrect) newQrMessage = `${process.env.REACT_APP_API_FE_BASE_URL}/claim-reward?token=${qrData.token}`
                        else dispatch(setErrorMessage({ errorMessage: "Hãy phân loại rác đúng cho lần sau nhé!" }));
                    } else dispatch(setErrorMessage({ errorMessage: "Không tìm thấy mã QR" }));
                    break;

                case EmbeddedSystemState.FINISHING:
                    if (classifyByUserName) {
                        messageMap[MessageKey.FINISHING] = defaultMessageFinishing.replace("{userName}", classifyByUserName);
                        newMessageKey = MessageKey.FINISHING;
                    } else dispatch(setErrorMessage({ errorMessage: "Không tìm thấy thông tin người tích điểm" }));
                    break;

                default:
                    break;
            }
        });

        setMessageKey(newMessageKey);
        setQrMessage(newQrMessage);
    }, [embeddedSystemData]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(setErrorMessage({ errorMessage: "" }));
        }, 5000);

        return () => clearTimeout(timeoutId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errorMessage]);

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

                <Flex direction="column" justify="center" gap="6" className={styles["status-bar-container"]}>
                    <StatusBar wasteType={WasteType.RECYCLABLE} embeddedSystemIP="192.168.137.20" />
                    <StatusBar wasteType={WasteType.ORGANIC} embeddedSystemIP="192.168.137.30" />
                    <StatusBar wasteType={WasteType.NON_RECYCLABLE} embeddedSystemIP="192.168.137.40" />
                </Flex>

                {messageKey && <BigMessage position="absolute" top="0" left="0" message={messageMap[messageKey]} onFinish={() => setMessageKey(undefined)} />}
                {qrMessage && <BigQr position="absolute" top="0" left="0" qrMessage={qrMessage} />}
                {errorMessage && <ErrorMessage position="absolute" top="0" left="0" message={errorMessage} />}
                {/* <BigQr position="absolute" top="0" left="0" qrMessage={"12312312"} /> */}
            </Flex>

            <Seo title="Home" />
        </>
    );
};

// Using for lazy loading page
export default HomePage;
