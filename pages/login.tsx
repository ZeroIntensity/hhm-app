import type { NextPage } from "next";
import type { FC } from "react";
import { useState } from "react";
import BoxWithHeader from "../components/boxWithHeader";
import Center from "../components/center";
import Button from "../components/button";
import Input from "../components/input";
import { useMutation, gql } from "@apollo/client";
import { LoadingIcon } from "../components/icons";

const CREATE_ACCOUNT = gql`
    mutation createAccount($username: String!, $password: String!) {
        createAccount(credentials: { name: $username, password: $password }) {
            id
        }
    }
`;

const LOG_IN = gql`
    mutation createAccount($username: String!, $password: String!) {
        login(credentials: { name: $username, password: $password })
    }
`;

const SignUp: FC<{}> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mutate, { data, loading, error }] = useMutation(CREATE_ACCOUNT);
    const showSpinner = data || loading;

    if (data) window.location.href = "/";

    return (
        <BoxWithHeader text="Sign Up">
            <form
                className="flex flex-col space-y-6"
                onSubmit={event => {
                    event.preventDefault();
                    mutate({ variables: { username, password } });
                }}
            >
                <div className="flex flex-col space-y-2">
                    {error && (
                        <div className="text-rose-500 font-bold text-sm w-fit">
                            {error.message}
                        </div>
                    )}
                    <Input
                        type="text"
                        placeholder="Username..."
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="•••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <Button disabled={loading} type="submit">
                    <div className="flex items-center justify-center">
                        {!showSpinner && <>Sign Up</>}{" "}
                        {showSpinner && <LoadingIcon />}
                    </div>
                </Button>
            </form>
        </BoxWithHeader>
    );
};

const Login: FC<{}> = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mutate, { data, loading, error }] = useMutation(LOG_IN);
    const showSpinner = data || loading;

    if (data) window.location.href = "/";

    return (
        <BoxWithHeader text="Log In">
            <form
                className="flex flex-col space-y-6"
                onSubmit={event => {
                    event.preventDefault();
                    mutate({ variables: { username, password } });
                }}
            >
                <div className="flex flex-col space-y-2">
                    {error && (
                        <div className="text-rose-500 font-bold text-sm w-fit">
                            {error.message}
                        </div>
                    )}
                    <Input
                        type="text"
                        placeholder="Username..."
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="•••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <Button disabled={loading} type="submit">
                    <div className="flex items-center justify-center">
                        {!showSpinner && <>Login</>}{" "}
                        {showSpinner && <LoadingIcon />}
                    </div>
                </Button>
            </form>
        </BoxWithHeader>
    );
};

const LoginPage: NextPage = () => (
    <Center>
        <div className="flex flex-col space-y-12 w-1/2">
            <Login />
            <SignUp />
        </div>
    </Center>
);
export default LoginPage;
