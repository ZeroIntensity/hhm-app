import type { FC, HTMLInputTypeAttribute, ChangeEventHandler } from "react";

const Input: FC<{
    type: HTMLInputTypeAttribute;
    placeholder: string;
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
}> = props => (
    <input
        type={props.type}
        className="form-input rounded bg-zinc-200 w-full border-none placeholder:italic font-semibold drop-shadow-sm focus:ring-0 hover:bg-zinc-300 focus:bg-zinc-300 transition-colors"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
    ></input>
);

export default Input;
