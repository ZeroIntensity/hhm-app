import type { PropsWithChildren } from "react";
import Box from "./box";

const BoxWithHeader = (props: PropsWithChildren<{ text: string }>) => (
    <Box>
        <div className="flex space-y-3 flex-col h-full">
            <p className="font-bold text-2xl break-words">{props.text}</p>

            {props.children}
        </div>
    </Box>
);

export default BoxWithHeader;
