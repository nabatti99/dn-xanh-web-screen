import { AppWebsocket } from "@api/websocket/app-websocket";
import { Icon } from "@components";
import { EmbeddedSystemState, WasteType } from "@pages/home/constants";
import { setClassifyUserName, setEmbeddedSystemState, setErrorMessage, setQrData, updateSensorsData } from "@pages/home/redux";
import { Badge, Flex, Section, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "@store";
import cls from "classnames";
import { useEffect, useState } from "react";
import { StatusBarProps } from "./type";

import styles from "./style.module.scss";
import { QrData } from "@pages/home/redux/type";

export const StatusBar = ({ embeddedSystemIP, wasteType, className, ...props }: StatusBarProps) => {
    const dispatch = useAppDispatch();

    const [appWebsocket, setAppWebsocket] = useState<AppWebsocket>();
    const isReady = appWebsocket && appWebsocket.ws.readyState === WebSocket.OPEN;

    const { embeddedSystemState, height, isDoorOpened } = useAppSelector((state) => state.home.embeddedSystemData[wasteType]);
    const { qrData } = useAppSelector((state) => state.home);

    const createWebsocket = async () => {
        const handleWebsocketMessage = (data: Record<string, any>) => {
            switch (data.type) {
                case "SENSORS_DATA":
                    dispatch(
                        updateSensorsData({
                            wasteType,
                            data: {
                                isDoorOpened: Number(data["isDoorOpened"]) === 1,
                                height: Number(data["height"]),
                            },
                        })
                    );
                    break;

                case "SET_STATE":
                    dispatch(
                        setEmbeddedSystemState({
                            wasteType,
                            embeddedSystemState: data["state"],
                        })
                    );

                    // if (data["state"] !== EmbeddedSystemState.CLAIM_REWARD && qrData?.embeddedSystemIP === embeddedSystemIP) dispatch(setQrData(undefined));

                    break;

                case "BUILD_QR":
                    dispatch(
                        setQrData({
                            embeddedSystemIP,
                            isCorrect: data["isCorrect"],
                            token: data["token"],
                        })
                    );
                    break;

                case "CLAIMED_REWARD":
                    dispatch(setClassifyUserName(data["userName"]));
                    break;

                case "ERROR":
                    dispatch(setErrorMessage({ errorMessage: data["message"] }));
                    break;

                default:
                    break;
            }
        };

        await new Promise((resolve) => setTimeout(resolve, Math.random() * 2000 + 1000));

        console.log(`Connecting websocket to ${embeddedSystemIP}...`);
        const newAppWebsocket = await AppWebsocket.getInstance(
            "RecycleEmbeddedSystem",
            `ws://${embeddedSystemIP}/ws`,
            (event) => {
                console.log("Connected", event);
            },
            (event) => {
                console.log("Message", event);
                handleWebsocketMessage(JSON.parse(event.data));
            },
            (event) => {
                console.log("Close", event);
                console.log(`Closing Websocket to ${embeddedSystemIP}...`);

                dispatch(
                    setEmbeddedSystemState({
                        wasteType,
                        embeddedSystemState: EmbeddedSystemState.IDLE,
                    })
                );

                setAppWebsocket(undefined);
            },
            (event) => {
                console.log("Error", event);
            }
        );

        console.log(newAppWebsocket);
        setAppWebsocket(newAppWebsocket);

        return newAppWebsocket;
    };

    useEffect(() => {
        if (appWebsocket) return;

        let newAppWebsocket: AppWebsocket | undefined = undefined;
        createWebsocket().then((appWebsocket) => (newAppWebsocket = appWebsocket));

        return () => {
            newAppWebsocket?.ws.close();
        };
    }, [appWebsocket]);

    const renderStatus = () => {
        switch (embeddedSystemState) {
            case EmbeddedSystemState.IDLE:
                return (
                    <>
                        <Icon ri="ri-leaf-fill" />
                        <Text>Nghỉ Ngơi</Text>
                    </>
                );

            case EmbeddedSystemState.OPENING_DOOR:
                return (
                    <>
                        <Icon ri="ri-run-fill" />
                        <Text>Hoạt Động</Text>
                    </>
                );

            case EmbeddedSystemState.COLLECTING_DATA:
                return (
                    <>
                        <Icon ri="ri-run-fill" />
                        <Text>Đang Xử Lý</Text>
                    </>
                );

            case EmbeddedSystemState.CLAIM_REWARD:
                return (
                    <>
                        <Icon ri="ri-qr-scan-2-line" />
                        <Text>Nhận Thưởng</Text>
                    </>
                );

            default:
                return (
                    <>
                        <Icon ri="ri-error-warning-fill" />
                        <Text>Lỗi</Text>
                    </>
                );
        }
    };

    const wasteStyleMap: Record<WasteType, any> = {
        [WasteType.ORGANIC]: styles["organic"],
        [WasteType.RECYCLABLE]: styles["recycle"],
        [WasteType.NON_RECYCLABLE]: styles["non-recycle"],
    };

    const wasteNameMap: Record<WasteType, string> = {
        [WasteType.ORGANIC]: "RÁC HỮU CƠ",
        [WasteType.RECYCLABLE]: "RÁC TÁI CHẾ",
        [WasteType.NON_RECYCLABLE]: "RÁC VÔ CƠ",
    };

    return (
        <Section position="relative" className={cls(styles["embedded-system-status"], wasteStyleMap[wasteType], className)} pt="0" {...props}>
            <Flex direction="column" gap="2">
                {!isReady && (
                    <Badge color="red" variant="solid" className={styles["badge"]}>
                        Lỗi Kết Nối
                    </Badge>
                )}

                {isReady && height < 20 && (
                    <Badge color="red" variant="solid" className={styles["badge"]}>
                        Đã Đầy
                    </Badge>
                )}

                <Flex direction="column">
                    <Text size="1" color="green" align="center" className={styles["title"]}>
                        {wasteNameMap[wasteType]}
                    </Text>

                    <Flex justify="start" gap="4" className={styles["container"]}>
                        {/* <Flex justify="center" align="center" gap="2">
                            {renderStatus()}
                        </Flex> */}

                        <Flex align="center" gap="2" className={styles["item"]}>
                            <Icon ri="ri-expand-height-fill" />
                            <Text>{height}cm</Text>
                        </Flex>

                        <Flex align="center" gap="3" className={styles["item"]}>
                            <Icon ri="ri-door-open-fill" />
                            <Text>{isDoorOpened ? "Mở cửa" : "Đóng cửa"}</Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Section>
    );
};
