import { Icon } from "@components";
import { Badge, Flex, Section, Text } from "@radix-ui/themes";
import cls from "classnames";
import { StatusBarProps } from "./type";
import { EmbeddedSystemState, WasteType } from "@pages/home/constants";
import { useAppSelector } from "@store";

import styles from "./style.module.scss";

export const StatusBar = ({ wasteType, className, ...props }: StatusBarProps) => {
    const { embeddedSystemState, height, isDoorOpened } = useAppSelector((state) => state.home);

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
        [WasteType.NON_RECYCLABLE]: "RÁC KHÔNG TÁI CHẾ",
    };

    return (
        <Section position="relative" className={cls(styles["embedded-system-status"], wasteStyleMap[wasteType], styles["active"], className)} {...props}>
            <Flex direction="column" gap="2">
                {height < 20 && (
                    <Badge color="red" className={styles["badge"]}>
                        Đã Đầy
                    </Badge>
                )}

                <Text size="1" color="green" align="center" className={styles["title"]}>
                    {wasteNameMap[wasteType]}
                </Text>

                <Flex direction="column" justify="center" align="center" gap="4" className={styles["container"]}>
                    <Flex justify="center" align="center" gap="2">
                        {renderStatus()}
                    </Flex>

                    <Flex justify="center" align="center" gap="2">
                        <Icon ri="ri-expand-height-fill" />
                        <Text>{height}cm</Text>
                    </Flex>

                    <Flex justify="center" align="center" gap="3">
                        <Icon ri="ri-door-open-fill" />
                        <Text>{isDoorOpened ? "Mở cửa" : "Đóng cửa"}</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Section>
    );
};
