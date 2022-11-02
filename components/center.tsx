import type { PropsWithChildren } from "react";

const Center = ({ children }: PropsWithChildren<{}>) => (
    <div className="flex items-center justify-center h-screen">{children}</div>
);

export default Center;
