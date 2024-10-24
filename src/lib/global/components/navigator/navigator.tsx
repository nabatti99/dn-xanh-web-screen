import { Container, Flex, Text } from "@radix-ui/themes";
import cls from "classnames";
import { NavLink } from "react-router-dom";
import { NavigatorProps } from "./type";

import styles from "./style.module.scss";

const navigationItems = [
    {
        title: "HOME",
        to: "/",
    },
    {
        title: "CHAT DEMO",
        to: "/chat",
    },
];

export const Navigator = ({ className, ...props }: NavigatorProps) => {
    return (
        <Container className={cls(styles["container"], className)} {...props}>
            <Flex direction="column" align="stretch" gap="4" mt="4">
                <Flex direction="column" justify="center" align="stretch" gap="4" wrap="wrap">
                    {navigationItems.map(({ title, to }) => (
                        <NavLink key={title} to={to} className={styles["nav-link"]}>
                            {({ isActive }) => <Text className={cls(styles["text"], isActive && styles["active"])}>{title}</Text>}
                        </NavLink>
                    ))}
                </Flex>
            </Flex>
        </Container>
    );
};
