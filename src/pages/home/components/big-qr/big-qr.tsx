import { Image } from "@components";
import { Box, Flex, Heading } from "@radix-ui/themes";
import cls from "classnames";
import { BigQrProps } from "./type";

import QRCode from "react-qr-code";
import styles from "./style.module.scss";

export const BigQr = ({ qrMessage, className, ...props }: BigQrProps) => {
    return (
        <Flex position="relative" flexGrow="1" direction="column" justify="center" align="center" className={cls(styles["title-container"], className)} {...props}>
            <Image
                src="https://image.vietnam.travel/sites/default/files/styles/top_banner/public/2018-10/danang%20travel%20guide.jpg?itok=BnNpkujX"
                alt="bg"
                className={styles["bg-image"]}
            />
            <Box className={styles["overlay"]} />
            <Flex position="relative" direction="column" align="center" gap="6">
                <Box asChild className={styles["qr"]}>
                    <QRCode value={qrMessage} size={400} />
                </Box>
                <Heading align="center" size="4" className={styles["title"]}>
                    QUÉT MÃ TÍCH ĐIỂM XANH
                </Heading>
            </Flex>
        </Flex>
    );
};
