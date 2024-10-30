import { Icon } from "@components";
import { EmbeddedSystemState, WasteType } from "@pages/home/constants";
import { Badge, Flex, Section, Text } from "@radix-ui/themes";
import { useAppDispatch, useAppSelector } from "@store";
import cls from "classnames";
import { StatusBarProps } from "./type";

import { AppWebsocket } from "@api/websocket/app-websocket";
import { setClassifyUserName, setEmbeddedSystemState, setQrData, updateSensorsData } from "@pages/home/redux";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

export const StatusBar = ({ embeddedSystemIP, wasteType, className, ...props }: StatusBarProps) => {
    const dispatch = useAppDispatch();

    const [appWebsocket, setAppWebsocket] = useState<AppWebsocket>();
    const { embeddedSystemState, height, isDoorOpened } = useAppSelector((state) => state.home.embeddedSystemData[wasteType]);

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
                break;

            case "BUILD_QR":
                dispatch(
                    setQrData({
                        isCorrect: data["isCorrect"],
                        token: data["token"]
                    })
                )
                break;

            case "BUILD_QR":
                dispatch(
                    setQrData({
                        isCorrect: data["isCorrect"],
                        token: data["token"]
                    })
                )
                break;

            case "FINISHED_QR":
                dispatch(
                    setClassifyUserName(data["userName"])
                );
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (appWebsocket) return;

        new AppWebsocket(
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
            case EmbeddedSystemState.SERVER_PROCESSING:
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
        [WasteType.RECYCLABLE]: styles["recycle"],
        [WasteType.ORGANIC]: styles["organic"],
        [WasteType.NON_RECYCLABLE]: styles["non-recycle"],
    };

    const wasteNameMap: Record<WasteType, string> = {
        [WasteType.RECYCLABLE]: "RÁC TÁI CHẾ",
        [WasteType.ORGANIC]: "RÁC HỮU CƠ",
        [WasteType.NON_RECYCLABLE]: "RÁC VÔ CƠ",
    };

    return (
        <Section position="relative" className={cls(styles["embedded-system-status"], wasteStyleMap[wasteType], className)} pt="0" {...props}>
            <Flex direction="column" gap="2">
                {height < 20 && (
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
