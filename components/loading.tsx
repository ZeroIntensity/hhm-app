import type { FC } from "react";
import Center from "./center";
import { LoadingIcon } from "./icons";

const Loading: FC<{}> = () => (
    <Center>
        <LoadingIcon />
    </Center>
);

export default Loading;
