import type { PropsWithChildren } from "react";

const Box = ({ children }: PropsWithChildren<{}>) => (
    <div className="bg-zinc-100 drop-shadow-lg rounded p-3 h-full">
        {children}
    </div>
);

export default Box;
