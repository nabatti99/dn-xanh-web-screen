import { Box, Flex, Heading } from "@radix-ui/themes";
import { BigMessageProps } from "./type";
import { Image } from "@components";
import { useEffect, useRef } from "react";
import cls from "classnames";

import styles from "./style.module.scss";

export const BigMessage = ({ message, onFinish = () => {}, className, ...props }: BigMessageProps) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        const timeoutId = setTimeout(() => {
            onFinish();
        }, 10000);

        timeoutRef.current = timeoutId;

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
