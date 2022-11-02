import type { PropsWithChildren, MouseEventHandler } from "react";
import Center from "./center";
import Box from "./box";
import Icon from "./icons";

const Modal = (
    props: PropsWithChildren<{
        title: string;
        callback: MouseEventHandler<HTMLDivElement>;
    }>
) => (
    <div className="bg-zinc-900 w-screen h-screen z-50 fixed bg-opacity-40 inset-0 overflow-y-auto">
        <Center>
            <div className="w-1/2">
                <Box>
                    <div className="flex space-y-3 flex-col">
                        <div className="flex items-center">
                            <p className="font-bold text-2xl">{props.title}</p>
                            <div className="ml-auto">
                                <Icon callback={props.callback}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </Icon>
                            </div>
                        </div>
                        {props.children}
                    </div>
                </Box>
            </div>
        </Center>
    </div>
);

export default Modal;
