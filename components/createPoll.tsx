import type { FC } from "react";
import { useMutation, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import Input from "./input";
import Button from "./button";
import Modal from "./modal";
import { LoadingIcon } from "./icons";

const CREATE_POLL = gql`
    mutation createPoll($pollName: String!, $choices: [String!]!) {
        createPoll(poll: { name: $pollName, choices: $choices }) {
            id
        }
    }
`;

const CreatePoll: FC<{ refetch: () => void }> = props => {
    const [modalOpen, setModalOpen] = useState(false);
    const [pollName, setPollName] = useState("");
    const [choices, setChoices] = useState("");
    const [choicesArray, setChoicesArray] = useState([]);
    const [lastWasComma, setLastWasComma] = useState(false);
    const [mutateFunction, { data, loading, error }] = useMutation(CREATE_POLL);

    useEffect(() => {
        setModalOpen(false);
        props.refetch();
    }, [data]);

    useEffect(() => {
        let current = choices[choices.length - 1];
        if (lastWasComma) {
            let str = choices.slice(0, choices.length - 2);
            if (str.match(/^ +$/)) return;

            setChoicesArray([
                // @ts-ignore
                ...choicesArray,
                // @ts-ignore
                str,
            ]);
            setChoices("");
        }
        setLastWasComma(current == ",");
    }, [choices]);

    const form = (
        <>
            {error && (
                <div className="text-rose-500 font-bold text-sm w-fit">
                    {error.message}
                </div>
            )}
            <Input
                type="text"
                placeholder="Poll Name..."
                value={pollName}
                onChange={e => setPollName(e.target.value)}
            />
            <div className="flex flex-col space-y-1">
                <div className="flex flex-wrap gap-1">
                    {choicesArray.map((choiceName, index) => (
                        <div
                            className="bg-zinc-200 rounded p-1 font-bold flex items-center space-x-1"
                            key={index}
                        >
                            <p>{choiceName}</p>

                            <svg
                                onClick={() => {
                                    let array = [...choicesArray];
                                    array.splice(index, 1);
                                    setChoicesArray(array);
                                }}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5 bg-zinc-300 rounded-full hover:bg-zinc-400 transition-all"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    ))}
                </div>
                <Input
                    type="text"
                    placeholder="Choices..."
                    value={choices}
                    onChange={e => setChoices(e.target.value)}
                />
                <p className="p-1 italic font-thin text-zinc-600 text-sm">
                    Choices must be seperated with a comma
                </p>
            </div>
            <Button
                onClick={() => {
                    if (choices != "" && !choices.match(/^ +$/)) {
                        // @ts-ignore
                        setChoicesArray([...choicesArray, choices]);
                    }
                }}
                type="submit"
            >
                Create
            </Button>
        </>
    );

    const modal = (
        <Modal
            title="Create Poll"
            callback={() => {
                setModalOpen(false);
            }}
        >
            <form
                className="flex flex-col space-y-3"
                onSubmit={e => {
                    e.preventDefault();
                    mutateFunction({
                        variables: { pollName, choices: choicesArray },
                    });
                    setPollName("");
                    setChoicesArray([]);
                    setLastWasComma(false);
                    setChoices("");
                }}
            >
                {loading ? (
                    <div className="flex items-center justify-center p-10">
                        <LoadingIcon />
                    </div>
                ) : (
                    form
                )}
            </form>
        </Modal>
    );

    return (
        <>
            {modalOpen && modal}
            <div
                className="bg-zinc-100 drop-shadow-sm rounded-full p-3 group hover:bg-zinc-200 transition-all cursor-pointer"
                onClick={() => setModalOpen(true)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 group-hover:rotate-90 duration-300"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
            </div>
        </>
    );
};

export default CreatePoll;
