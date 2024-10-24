import { FlexProps } from "@radix-ui/themes";

export type BigMessageProps = FlexProps & {
    message: string;
    onFinish?: () => void;
};
