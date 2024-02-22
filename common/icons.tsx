import IconTextPlus from "tabler_icons_tsx/tsx/text-plus.tsx";
import IconTextCaption from "tabler_icons_tsx/tsx/text-caption.tsx";
import IconFileText from "tabler_icons_tsx/tsx/file-text.tsx";
import IconAlignLeft from "tabler_icons_tsx/tsx/align-left.tsx";
import IconAlignCenter from "tabler_icons_tsx/tsx/align-center.tsx";
import IconAlignRight from "tabler_icons_tsx/tsx/align-right.tsx";
import IconPhoto from "tabler_icons_tsx/tsx/photo.tsx";
import IconPhotoPlus from "tabler_icons_tsx/tsx/photo-plus.tsx";
import IconPlus from "tabler_icons_tsx/tsx/plus.tsx";
import IconQuestionMark from "tabler_icons_tsx/tsx/question-mark.tsx";
import IconX from "tabler_icons_tsx/tsx/x.tsx";
import IconAdjustmentsHorizontal from "tabler_icons_tsx/tsx/adjustments-horizontal.tsx";
import IconAlignJustified from "tabler_icons_tsx/tsx/align-justified.tsx";
import IconTextIncrease from "tabler_icons_tsx/tsx/text-increase.tsx";
import IconTextDecrease from "tabler_icons_tsx/tsx/text-decrease.tsx";
import IconArrowsDiagonal from "tabler_icons_tsx/tsx/arrows-diagonal.tsx";
import IconArrowsDiagonalMinimize2 from "tabler_icons_tsx/tsx/arrows-diagonal-minimize-2.tsx";
import IconLayoutAlignMiddle from "tabler_icons_tsx/tsx/layout-align-middle.tsx";
import IconRotate2 from "tabler_icons_tsx/tsx/rotate-2.tsx";
import IconRotateClockwise from "tabler_icons_tsx/tsx/rotate-clockwise.tsx";
import IconRotateClockwise2 from "tabler_icons_tsx/tsx/rotate-clockwise-2.tsx";
import IconFlipVertical from "tabler_icons_tsx/tsx/flip-vertical.tsx";
import IconFlipHorizontal from "tabler_icons_tsx/tsx/flip-horizontal.tsx";
import IconArrowBarUp from "tabler_icons_tsx/tsx/arrow-bar-up.tsx";
import IconArrowBarDown from "tabler_icons_tsx/tsx/arrow-bar-down.tsx";
import IconPrinter from "tabler_icons_tsx/tsx/printer.tsx";
import IconSettings from "tabler_icons_tsx/tsx/settings.tsx";
import IconMinus from "tabler_icons_tsx/tsx/minus.tsx";
import IconClipboardPlus from "tabler_icons_tsx/tsx/clipboard-plus.tsx";
import { INL_ICON_COLOR, INL_ICON_SIZE } from "./constants.ts";

export const Icons = {
    IconTextPlus,
    IconTextCaption,
    IconFileText,
    IconAlignLeft,
    IconAlignCenter,
    IconAlignRight,
    IconAlignJustified,
    IconPhoto,
    IconPhotoPlus,
    IconPlus,
    IconQuestionMark,
    IconAdjustmentsHorizontal,
    IconTextIncrease,
    IconTextDecrease,
    IconArrowsDiagonal,
    IconArrowsDiagonalMinimize2,
    IconLayoutAlignMiddle,
    IconRotate2,
    IconRotateClockwise,
    IconRotateClockwise2,
    IconFlipHorizontal,
    IconFlipVertical,
    IconArrowBarUp,
    IconArrowBarDown,
    IconX,
    IconPrinter,
    IconSettings,
    IconMinus,
    IconClipboardPlus,
};

for (const key in Icons) {
    const icon = Icons[key as keyof typeof Icons];
    Icons[key as keyof typeof Icons] = (
        props: { [key: string]: string | number },
    ) => {
        props.size = props.size || INL_ICON_SIZE;
        props.color = props.color || INL_ICON_COLOR;
        return icon(props);
    };
}

export function icon(label: keyof typeof Icons) {
    const Icon = Icons[label];
    return <Icon size={INL_ICON_SIZE} color="currentColor" />;
}
