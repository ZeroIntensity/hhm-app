import type { FC } from "react";
import Center from "./center";
import { ErrorIcon } from "./icons";

const Error: FC<{}> = () => (
    <Center>
        <div className="flex items-center flex-col">
            <ErrorIcon />
            <p className="font-bold text-zinc-500 text-xl">
                Failed to fetch data from server...
            </p>
        </div>
    </Center>
);

export default Error;
