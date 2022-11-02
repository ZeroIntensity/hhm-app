import type { NextPage } from "next";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import BoxWithHeader from "../components/boxWithHeader";
import Icon, { LoadingIcon, ErrorIcon } from "../components/icons";
import Error from "../components/error";
import Loading from "../components/loading";
import Button, { SelectedButton } from "../components/button";
import LikesDislike from "../components/likeDislikeButtons";
import CreatePoll from "../components/createPoll";
import Modal from "../components/modal";
import Input from "../components/input";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
dayjs.extend(relativeTime);

const GET_POLLS = gql`
    query {
        polls {
            name
            likes {
                id
                selected
            }
            dislikes {
                id
                selected
            }
            choices {
                content
                users {
                    id
                }
                id
                percent
            }
            comments {
                id
            }
            id
        }

        currentUser {
            id
            likes {
                id
            }
            dislikes {
                id
            }
        }
    }
`;

const CHOICES = gql`
    query choices($pollId: Int!) {
        poll(pollId: $pollId) {
            choices {
                content
                users {
                    id
                }
                id
                percent
            }
        }
    }
`;

const GET_COMMENTS = gql`
    query comments($pollId: Int!) {
        comments(pollId: $pollId) {
            id
            author {
                name
                id
            }
            content
            createdAt
        }
    }
`;

const SET_VOTE = gql`
    mutation pollVote($id: Int!) {
        pollVote(choiceId: $id) {
            id
        }
    }
`;

const CREATE_COMMENT = gql`
    mutation createComment($pollId: Int!, $content: String!) {
        createComment(pollId: $pollId, comment: $content) {
            id
        }
    }
`;

const DELETE_COMMENT = gql`
    mutation deleteComment($commentId: Int!) {
        deleteComment(commentId: $commentId) {
            id
        }
    }
`;

interface Comment {
    id: number;
    author: {
        name: string;
        id: number;
    };
    content: string;
    createdAt: number;
}

export type LikeDislike = Array<{ id: number; selected: boolean }>;

interface ChoiceType {
    users: Array<{
        id: number;
    }>;
    content: string;
    id: number;
    percent: number;
    selected: boolean;
}

export interface PollType {
    name: string;
    choices: Array<ChoiceType>;
    likes: LikeDislike;
    dislikes: LikeDislike;
    id: number;
    comments: Array<{ id: number }>;
}

export interface User {
    id: number;
    likes: Array<{ id: number }>;
    dislikes: Array<{ id: number }>;
}

const Choice: FC<{
    name: string;
    selected: boolean;
    id: number;
    percent: number;
    refetch: () => void;
    chosen: boolean;
    user?: User;
}> = props => {
    const [mutateFunction] = useMutation(SET_VOTE, {
        errorPolicy: "ignore",
    });
    const Element = props.selected ? SelectedButton : Button;

    return (
        <Element
            onClick={() => {
                if (!props.user) window.location.href = "/login";
                else {
                    mutateFunction({ variables: { id: props.id } }).then(() =>
                        props.refetch()
                    );
                }
            }}
        >
            <div className="flex flex-col items-center">
                <p className="text-xl break-words w-full">{props.name}</p>
                {props.chosen && (
                    <p
                        className={`font-bold text-sm p-1 rounded ${
                            Element == SelectedButton
                                ? "bg-slate-200"
                                : "bg-zinc-300"
                        } h-fit w-fit drop-shadow-md`}
                    >
                        {props.percent}%
                    </p>
                )}
            </div>
        </Element>
    );
};

const Poll: FC<{
    poll: PollType;
    refetch: () => void;
    commentCallback: () => void;
    commentLength: number;
    currentUser: User | undefined;
}> = props => {
    const chosen = props.poll.choices.some(o =>
        o.users.some(u => u.id == props.currentUser?.id)
    );
    const [query, { data, loading, refetch }] = useLazyQuery(CHOICES, {
        variables: { pollId: props.poll.id },
        errorPolicy: "ignore",
    });

    return (
        <BoxWithHeader text={props.poll.name}>
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-2 gap-2 h-full">
                    {loading ? (
                        <LoadingIcon />
                    ) : (
                        (data?.poll.choices || props.poll.choices).map(
                            (choice: ChoiceType) => (
                                <Choice
                                    key={choice.id}
                                    user={props.currentUser}
                                    percent={choice.percent}
                                    refetch={() => {
                                        query();
                                        refetch();
                                    }}
                                    selected={choice.users.some(o =>
                                        props.currentUser
                                            ? o.id == props.currentUser.id
                                            : false
                                    )}
                                    name={choice.content}
                                    id={choice.id}
                                    chosen={chosen}
                                />
                            )
                        )
                    )}
                </div>
                <div className="flex mt-auto pt-2">
                    <LikesDislike
                        poll={props.poll}
                        refetch={props.refetch}
                        user={props.currentUser}
                    />
                    <div className="ml-auto">
                        <div className="flex items-center">
                            <div
                                className="rounded transition-all p-1 hover:bg-zinc-200 cursor-pointer flex space-x-1"
                                onClick={props.commentCallback}
                            >
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
                                        d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                    />
                                </svg>
                                <p className="font-bold">
                                    {props.commentLength}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BoxWithHeader>
    );
};

const CommentModal: FC<{
    commentCallback: () => void;
    pollId: number | null;
    currentUser: User | undefined;
    refetch: () => void;
}> = props => {
    const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
        variables: { pollId: props.pollId },
        pollInterval: 2000,
    });

    const [comment, setComment] = useState("");
    const isLogged = Boolean(props.currentUser);
    const [mutateFunction, commentGraphQL] = useMutation(CREATE_COMMENT);
    const [mutateDeleteFunction, deleteCommentGraphQL] = useMutation(
        DELETE_COMMENT,
        { errorPolicy: "ignore" }
    );

    useEffect(() => {
        refetch();
    }, [commentGraphQL.data, deleteCommentGraphQL.data]);
    if (!props.pollId) return <></>;

    return (
        <Modal title="Comments" callback={props.commentCallback}>
            <div className="h-96">
                {error ? (
                    <div className="max-h-3/4 flex items-center justify-center p-2 flex-col space-y-4 py-10">
                        <ErrorIcon />
                        <p className="text-zinc-600 text-xl font-bold">
                            Failed to load comments...
                        </p>
                    </div>
                ) : loading ? (
                    <LoadingIcon />
                ) : (
                    <div className="flex flex-col space-y-3 max-h-full h-full">
                        <div className="flex flex-col space-y-2 overflow-y-auto flex-1">
                            {data.comments.map((comment: Comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-zinc-100 border-2 border-dotted border-zinc-200 rounded p-2 flex flex-wrap items-center"
                                >
                                    <div className="w-5/6">
                                        <div className="flex space-x-2 items-center">
                                            <p className="font-bold text-lg">
                                                {comment.author.name}
                                            </p>

                                            <p className="text-sm font-bold text-zinc-600">
                                                {dayjs(
                                                    comment.createdAt * 1000
                                                ).fromNow()}
                                            </p>
                                        </div>
                                        <p className="font-thin break-words">
                                            {comment.content}
                                        </p>
                                    </div>

                                    {props.currentUser?.id ==
                                        comment.author.id && (
                                        <div className="ml-auto">
                                            <Icon
                                                callback={() => {
                                                    mutateDeleteFunction({
                                                        variables: {
                                                            commentId:
                                                                comment.id,
                                                        },
                                                    });
                                                }}
                                            >
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
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                            </Icon>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {data.comments.length == 0 && (
                                <div className="flex flex-col items-center justify-center py-24">
                                    <p className="text-zinc-700 font-bold text-2xl">
                                        No comments
                                    </p>
                                    <p className="text-zinc-700 font-thin text-lg">
                                        Be the first to make a comment
                                    </p>
                                </div>
                            )}
                        </div>
                        {isLogged ? (
                            <form
                                className="mt-auto"
                                onSubmit={e => {
                                    e.preventDefault();
                                    mutateFunction({
                                        variables: {
                                            pollId: props.pollId,
                                            content: comment,
                                        },
                                    }).then(() => props.refetch());
                                    setComment("");
                                }}
                            >
                                {commentGraphQL.error && (
                                    <p className="text-rose-500 font-bold text-sm py-1">
                                        {commentGraphQL.error.message}
                                    </p>
                                )}
                                <div className="flex space-x-2">
                                    <Input
                                        type="text"
                                        placeholder="Your comment..."
                                        value={comment}
                                        onChange={e =>
                                            setComment(e.target.value)
                                        }
                                    />
                                    <Button type="submit">
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
                                                d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 01-12 0v-3"
                                            />
                                        </svg>
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <p className="text-zinc-700 font-bold text-sm text-center">
                                You must be{" "}
                                <Link
                                    className="text-indigo-500 hover:text-indigo-400 transition-all"
                                    href="/login"
                                >
                                    logged in
                                </Link>{" "}
                                to create a comment.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    );
};

const Polls: NextPage = () => {
    const { loading, error, data, refetch } = useQuery(GET_POLLS, {
        pollInterval: 2000,
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCommentPollId, setCurrentCommentPollId] = useState(0);
    const user: User | undefined = data?.currentUser;

    useEffect(() => {
        refetch();
    });

    return (
        <div className="flex h-screen items-center flex-col space-y-6 py-4">
            {error ? (
                <Error />
            ) : loading ? (
                <Loading />
            ) : (
                <>
                    <div>
                        {modalOpen && (
                            <CommentModal
                                currentUser={user}
                                commentCallback={() => setModalOpen(false)}
                                pollId={currentCommentPollId}
                                refetch={refetch}
                            />
                        )}
                    </div>
                    {user && (
                        <div>
                            <CreatePoll refetch={refetch} />
                        </div>
                    )}
                    <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 w-3/4 py-2">
                        {data.polls.map((poll: PollType) => (
                            <li key={poll.id}>
                                <Poll
                                    currentUser={user}
                                    poll={poll}
                                    refetch={refetch}
                                    commentCallback={() => {
                                        setCurrentCommentPollId(poll.id);
                                        setModalOpen(true);
                                    }}
                                    commentLength={poll.comments.length}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Polls;
