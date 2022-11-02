import type { NextPage } from "next";
import { useMutation, gql } from "@apollo/client";
import Loading from "../components/loading";
import Error from "../components/error";
import { useEffect, useState } from "react";

const LOGOUT = gql`
    mutation {
        logout
    }
`;

const Logout: NextPage = () => {
    const [mutateFunction, { data, loading, error }] = useMutation(LOGOUT);
    const [sentGraphQL, setSentGraphQL] = useState(false);

    useEffect(() => {
        if (!sentGraphQL) mutateFunction();
        setSentGraphQL(true);
    }, [sentGraphQL, mutateFunction]);

    if (loading) return <Loading />;
    if (error) return <Error />;
    if (data) window.location.href = "/";
    return <></>;
};

export default Logout;
