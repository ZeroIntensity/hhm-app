import type { PropsWithChildren, MouseEventHandler } from "react";

const Button = (
    props: PropsWithChildren<{
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        onClick?: MouseEventHandler<HTMLButtonElement>;
    }>
) => (
    <button
        onClick={props.onClick}
        type={props.type}
        disabled={props.disabled}
        className="p-2 bg-zinc-200 rounded font-semibold cursor-pointer hover:bg-zinc-300 active:animate-pulse hover:animate-pulse transition-all text-lg disabled:bg-zinc-100"
    >
        {props.children}
    </button>
);

export const SelectedButton = (
    props: PropsWithChildren<{ onClick?: MouseEventHandler<HTMLButtonElement> }>
) => (
    <button
        onClick={props.onClick}
        className="p-2 bg-slate-300 rounded font-semibold cursor-pointer hover:bg-slate-400 active:animate-pulse hover:animate-pulse transition-all text-lg"
    >
        {props.children}
    </button>
);

export default Button;
