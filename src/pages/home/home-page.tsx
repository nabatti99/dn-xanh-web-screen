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
import { setErrorMessage, setQrData } from "./redux";
import { VoiceMessage } from "./components/voice-message";
import { useAppWebsocketFront } from "./hooks/useAppWebsocketFront";

enum VoiceMessageKey {
    GREETING = "GREETING",
    THANKS = "THANKS",
    REMIND_ERROR = "REMIND_ERROR",
    QR = "QR",
    GREEN_POINT = "GREEN_POINT",
    WASTE_TYPE_ORGANIC = "WASTE_TYPE_ORGANIC",
    WASTE_TYPE_RECYCLABLE = "WASTE_TYPE_RECYCLABLE",
    WASTE_TYPE_NON_RECYCLABLE = "WASTE_TYPE_NON_RECYCLABLE",
}

const voiceMessageMap: Record<VoiceMessageKey, string> = {
    [VoiceMessageKey.GREETING]: "/voices/greeting.mp3",
    [VoiceMessageKey.THANKS]: "/voices/thanks.mp3",
    [VoiceMessageKey.REMIND_ERROR]: "/voices/remind-error.mp3",
    [VoiceMessageKey.QR]: "/voices/qr.mp3",
    [VoiceMessageKey.GREEN_POINT]: "/voices/green-point.mp3",
    [VoiceMessageKey.WASTE_TYPE_ORGANIC]: "/voices/waste-type-organic.mp3",
    [VoiceMessageKey.WASTE_TYPE_RECYCLABLE]: "/voices/waste-type-recyclable.mp3",
    [VoiceMessageKey.WASTE_TYPE_NON_RECYCLABLE]: "/voices/waste-type-non-recyclable.mp3",
};

enum MessageKey {
    GREETING = "GREETING",
    PROCESSING = "PROCESSING",
    WAITING_OPEN_DOOR = "WAITING_OPEN_DOOR",
    FINISHING = "FINISHING",
    QR_GENERATING = "QR_GENERATING",
}

const messageMap: Record<MessageKey, string> = {
    [MessageKey.GREETING]: "Hãy phân loại rác đúng cách!",
    [MessageKey.PROCESSING]: "Đang xử lý...Bạn chờ chút nhé!",
    [MessageKey.WAITING_OPEN_DOOR]: "Rác này là {wasteType}. Hãy bỏ rác đúng thùng nhé!",
    [MessageKey.QR_GENERATING]: "Đang tạo mã QR...",
    [MessageKey.FINISHING]: "Cảm ơn bạn đã phân loại rác!",
};

export const HomePage = ({}: HomePageProps) => {
    const dispatch = useAppDispatch();
    const { embeddedSystemData, qrData, errorMessage, classifyByUserName } = useAppSelector((state) => state.home);

    const appWebsocketFront = useAppWebsocketFront("192.168.137.100");

    const [voiceMessageKey, setVoiceMessageKey] = useState<VoiceMessageKey>();
    const [messageKey, setMessageKey] = useState<MessageKey>();
    const [qrMessage, setQrMessage] = useState<string>();

    useEffect(() => {
        // let newVoiceMessageKey: VoiceMessageKey | undefined = undefined;
        let newVoiceMessageKey: VoiceMessageKey | undefined = VoiceMessageKey.GREETING;
        let newMessageKey: MessageKey | undefined = undefined;
        let newQrMessage: string | undefined = undefined;

        if (qrData && !qrData.isCorrect) {
            dispatch(setErrorMessage({ errorMessage: "Hãy phân loại rác đúng cho lần sau nhé!" }));
            dispatch(setQrData(undefined));
        }

        // Object.values(embeddedSystemData).forEach((state) => {
        //     switch (state.embeddedSystemState) {
        //         case EmbeddedSystemState.OPENING_DOOR:
        //             newMessageKey = MessageKey.DOOR_OPENED;
        //             break;

        //         case EmbeddedSystemState.COLLECTING_DATA:
        //         case EmbeddedSystemState.SERVER_PROCESSING:
        //             newMessageKey = MessageKey.PROCESSING;
        //             break;

        //         case EmbeddedSystemState.CLAIM_REWARD:
        //             if (qrData) {
        //                 if (qrData.isCorrect) {
        //                     newQrMessage = `${process.env.REACT_APP_API_FE_BASE_URL}/claim-reward?token=${qrData.token}`;
        //                     setQrMessage(newQrMessage);

        //                     setTimeout(() => {
        //                         setQrData(undefined);
        //                         setQrMessage(undefined);
        //                     }, 10000);
        //                 }
        //             }
        //             // else {
        //             //     dispatch(setErrorMessage({ errorMessage: "Không tìm thấy mã QR" }));
        //             //     dispatch(setQrData(undefined));
        //             // }
        //             break;

        //         // case EmbeddedSystemState.FINISHING:
        //         //     if (classifyByUserName) {
        //         //         messageMap[MessageKey.FINISHING] = defaultMessageFinishing.replace("{userName}", classifyByUserName);
        //         //         newMessageKey = MessageKey.FINISHING;
        //         //     } else {
        //         //         dispatch(setErrorMessage({ errorMessage: "Không tìm thấy thông tin người tích điểm" }));
        //         //         dispatch(setQrData(undefined));
        //         //     }
        //         //     break;

        //         default:
        //             break;
        //     }
        // });

        setMessageKey(newMessageKey);
        setVoiceMessageKey(newVoiceMessageKey);
        // setQrMessage(newQrMessage);
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

                {/* <Flex direction="column" justify="center" gap="6" className={styles["status-bar-container"]}>
                    <StatusBar wasteType={WasteType.RECYCLABLE} embeddedSystemIP="192.168.137.20" />
                    <StatusBar wasteType={WasteType.ORGANIC} embeddedSystemIP="192.168.137.30" />
                    <StatusBar wasteType={WasteType.NON_RECYCLABLE} embeddedSystemIP="192.168.137.40" />
                </Flex> */}

                {/* {voiceMessageKey && <VoiceMessage voice={voiceMessageMap[voiceMessageKey]} onFinish={() => setVoiceMessageKey(undefined)} />} */}
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
