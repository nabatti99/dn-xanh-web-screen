import { Image } from "@components";
import { Seo } from "@global/components";
import { Box, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { BigMessage } from "./components";
import { HomePageProps } from "./type";
import { useAppDispatch, useAppSelector } from "@store";
import { BigQr } from "./components/big-qr";
import { StatusBar } from "./components/status-bar";
import { EmbeddedSystemFrontState, EmbeddedSystemState, WasteType, wasteTypeMap } from "./constants";

import styles from "./style.module.scss";
import { ErrorMessage } from "./components/error-message";
import { setErrorMessage, setQrData } from "./redux";
import { VoiceMessage } from "./components/voice-message";
import { useAppWebsocketFront } from "./hooks/useAppWebsocketFront";

enum VoiceMessageKey {
    GREETING = "GREETING",
    THANKS = "THANKS",
    REMINDING = "REMINDING",
    QR = "QR",
    GREEN_POINT = "GREEN_POINT",
    WASTE_TYPE_ORGANIC = "WASTE_TYPE_ORGANIC",
    WASTE_TYPE_RECYCLABLE = "WASTE_TYPE_RECYCLABLE",
    WASTE_TYPE_NON_RECYCLABLE = "WASTE_TYPE_NON_RECYCLABLE",
}

const voiceMessageMap: Record<VoiceMessageKey, string> = {
    [VoiceMessageKey.GREETING]: "/voices/greeting.mp3",
    [VoiceMessageKey.THANKS]: "/voices/thanks.mp3",
    [VoiceMessageKey.REMINDING]: "/voices/remind.mp3",
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
    REMINDING = "REMINDING",
    THANKS = "THANKS",
    CLAIM_REWARD = "CLAIM_REWARD",
}

const messageMap: Record<MessageKey, string> = {
    [MessageKey.GREETING]: "Hãy phân loại rác đúng cách!",
    [MessageKey.PROCESSING]: "Đang xử lý...Bạn chờ chút nhé!",
    [MessageKey.WAITING_OPEN_DOOR]: "Rác này là {wasteType}. Hãy bỏ rác đúng thùng nhé!",
    [MessageKey.CLAIM_REWARD]: "Hãy quét mã QR để nhận điểm xanh nhé!",
    [MessageKey.REMINDING]: "Bạn ơi! Hãy phân loại rác cho lần sau nhé!",
    [MessageKey.THANKS]: "Cảm ơn {userName} đã phân loại rác!",
};

export const HomePage = ({}: HomePageProps) => {
    const dispatch = useAppDispatch();
    const { embeddedSystemFrontData, embeddedSystemData, qrData, errorMessage, classifyByUserName } = useAppSelector((state) => state.home);

    const appWebsocketFront = useAppWebsocketFront("192.168.100.100");

    const [voiceMessageKey, setVoiceMessageKey] = useState<VoiceMessageKey>();
    const [message, setMessage] = useState<string>();
    const [qrMessage, setQrMessage] = useState<string>();

    useEffect(() => {
        // let newVoiceMessageKey: VoiceMessageKey | undefined = undefined;
        let newVoiceMessageKey: VoiceMessageKey | undefined = undefined;
        let newMessage: string | undefined = undefined;
        let newQrMessage: string | undefined = undefined;

        // if (qrData && !qrData.isCorrect) {
        //     dispatch(setErrorMessage({ errorMessage: "Bạn ơi! Hãy phân loại rác cho lần sau nhé!" }));
        //     dispatch(setQrData(undefined));
        // }

        Object.keys(embeddedSystemData).forEach((wasteType: string) => {
            const state = embeddedSystemData[wasteType as WasteType];
            switch (state.embeddedSystemState) {
                case EmbeddedSystemState.WAITING_FOR_OPEN_DOOR:
                case EmbeddedSystemState.OPENING_DOOR:
                    newVoiceMessageKey = VoiceMessageKey[`WASTE_TYPE_${wasteType.toUpperCase()}` as keyof typeof VoiceMessageKey];
                    newMessage = messageMap[MessageKey.WAITING_OPEN_DOOR].replace("{wasteType}", wasteTypeMap[wasteType as WasteType]);
                    break;

                case EmbeddedSystemState.COLLECTING_DATA:
                    newMessage = messageMap[MessageKey.PROCESSING];
                    break;

                case EmbeddedSystemState.CLAIM_REWARD:
                    newVoiceMessageKey = VoiceMessageKey.QR;
                    if (qrData && !qrMessage) {
                        newQrMessage = `${process.env.REACT_APP_API_FE_BASE_URL}/claim-reward?token=${qrData.token}`;
                        setQrMessage(newQrMessage);

                        setTimeout(() => {
                            setQrData(undefined);
                            setQrMessage(undefined);
                        }, 10000);
                    }
                    break;

                case EmbeddedSystemState.REQUESTING_FINISH:
                    setQrData(undefined);
                    setQrMessage(undefined);
                    break;

                default:
                    break;
            }
        });

        switch (embeddedSystemFrontData.embeddedSystemFrontState) {
            case EmbeddedSystemFrontState.COLLECTING_DATA:
                newMessage = messageMap[MessageKey.PROCESSING];
                break;

            case EmbeddedSystemFrontState.REQUESTING_OPEN_DOOR:
            case EmbeddedSystemFrontState.WAITING_ESP32_MAIN:
                break;

            case EmbeddedSystemFrontState.REMINDING:
                newVoiceMessageKey = VoiceMessageKey.REMINDING;
                dispatch(setErrorMessage({ errorMessage: messageMap[MessageKey.REMINDING] }));
                break;

            case EmbeddedSystemFrontState.THANKS:
                if (classifyByUserName) {
                    newVoiceMessageKey = VoiceMessageKey.THANKS;
                    newMessage = messageMap[MessageKey.THANKS].replace("{userName}", classifyByUserName);
                } else {
                    dispatch(setErrorMessage({ errorMessage: "Không tìm thấy thông tin người tích điểm" }));
                    dispatch(setQrData(undefined));
                }
                break;

            default:
                break;
        }

        setMessage(newMessage);
        setVoiceMessageKey(newVoiceMessageKey);
        // setQrMessage(newQrMessage);
    }, [embeddedSystemData, embeddedSystemFrontData]);

    useEffect(() => {
        setQrData(undefined);
        setQrMessage(undefined);

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
                    <StatusBar wasteType={WasteType.ORGANIC} embeddedSystemIP="192.168.100.20" />
                    <StatusBar wasteType={WasteType.RECYCLABLE} embeddedSystemIP="192.168.100.30" />
                    <StatusBar wasteType={WasteType.NON_RECYCLABLE} embeddedSystemIP="192.168.100.40" />    
                </Flex>

                {voiceMessageKey && <VoiceMessage voice={voiceMessageMap[voiceMessageKey]} />}
                {message && <BigMessage position="absolute" top="0" left="0" message={message} onFinish={() => setMessage(undefined)} />}
                {qrMessage && <BigQr position="absolute" top="0" left="0" qrMessage={qrMessage} />}
                {errorMessage && <ErrorMessage position="absolute" top="0" left="0" message={errorMessage} />}
                {/* <BigMessage position="absolute" top="0" left="0" message={messageMap[MessageKey.THANKS]} onFinish={() => setMessage(undefined)} /> */}
            </Flex>

            <Seo title="Home" />
        </>
    );
};

// Using for lazy loading page
export default HomePage;
