import { Box, Flex, Heading } from "@radix-ui/themes";
import { BigMessageProps } from "./type";
import { Image } from "@components";
import { useEffect } from "react";
import cls from "classnames";

import styles from "./style.module.scss";

export const ErrorMessage = ({ message, onFinish = () => {}, className, ...props }: BigMessageProps) => {
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFinish();
        }, 5000);

        return () => clearTimeout(timeoutId);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message, onFinish]);

    return (
        <Flex position="relative" flexGrow="1" direction="column" justify="center" align="center" className={cls(styles["title-container"], className)} {...props}>
            <Image
                src="https://image.vietnam.travel/sites/default/files/styles/top_banner/public/2018-10/danang%20travel%20guide.jpg?itok=BnNpkujX"
                alt="bg"
                className={styles["bg-image"]}
            />
            <Box className={styles["overlay"]} />
            <Heading align="center" className={styles["title"]}>
                {message}
            </Heading>
        </Flex>
    );
};
