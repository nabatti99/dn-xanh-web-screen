import { WasteType } from "@pages/home/constants";
import { SectionProps } from "@radix-ui/themes";

export type StatusBarProps = SectionProps & {
    embeddedSystemIP: string;
    wasteType: WasteType;
};
