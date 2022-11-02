import type { NextPage } from "next";
import Image from "next/image";
import Box from "../components/box";
import type { FC } from "react";
import Link from "next/link";

const URL: FC<{ url: string; text: string }> = props => (
    <Link
        className="text-slate-700 font-bold hover:text-slate-400 transition-all"
        href={props.url}
    >
        {props.text}
    </Link>
);

const Home: NextPage = () => (
    <div className="flex justify-center">
        <div className="flex flex-col w-screen items-center justify-center space-y-12 max-h-screen py-40 md:py-32 2xl:py-10">
            <div className="flex flex-col items-center space-y-3 w-3/4">
                <div className="bg-zinc-100 rounded p-4 drop-shadow-sm flex items-center flex-col space-y-3">
                    <h1 className="font-bold text-3xl text-zinc-700 border-2 p-1 rounded border-dashed px-2">
                        HHM Project
                    </h1>
                    <h2 className="font-thin text-lg text-zinc-600 italic">
                        This site is a simple polls app for demonstrating
                        FastAPI and NextJS. Read about them below.
                    </h2>
                </div>
                <div className="flex space-x-3">
                    <Link href="/login">
                        <a className="hover:shadow-md hover:bg-zinc-200 active:bg-zinc-300 bg-zinc-100 hover:scale-110 drop-shadow-sm font-bold rounded-full px-5 p-3 hover:border-zinc-300 transition-all text-xl">
                            Login
                        </a>
                    </Link>
                    <Link href="/polls">
                        <a className="hover:shadow-md hover:bg-zinc-200 active:bg-zinc-300 bg-zinc-100 hover:scale-110 drop-shadow-sm font-bold rounded-full px-5 p-3 hover:border-zinc-300 transition-all text-xl">
                            Try It
                        </a>
                    </Link>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-3/4 h-1/2">
                <Box>
                    <div className="flex flex-col py-5">
                        <Image
                            src="/fastapi.svg"
                            height={80}
                            width={80}
                            alt="FastAPI logo"
                        />
                        <p className="text-zinc-600 italic font-thin pt-2">
                            FastAPI was built by Sebastián Ramírez at the end of
                            2018 for the Python programming language. It
                            specializes in speed and making the life of the
                            developer easier.
                            <br />
                            <br />
                            Ramírez originally wrote it to fulfill his own needs
                            for creating websites, as he failed to find anything
                            that was what he wanted. Today, It continues to
                            outperform the world&lsquo;s most popular web
                            frameworks. <br />
                            <br /> See{" "}
                            <URL
                                url="https://fastapi.tiangolo.com"
                                text="FastAPI's website"
                            />{" "}
                            here.
                        </p>
                    </div>
                </Box>
                <Box>
                    <div className="flex flex-col py-5">
                        <Image
                            src="/nextjs.svg"
                            height={80}
                            width={80}
                            alt="NextJS logo"
                        />
                        <p className="text-zinc-600 italic font-thin pt-2">
                            NextJS is a JavaScript framework originally written
                            by Guillermo Rauch and released on behalf of{" "}
                            <URL url="https://vercel.com" text="Vercel" />.
                            It&lsquo;s built on top of the{" "}
                            <URL url="https://reactjs.org/" text="ReactJS" />{" "}
                            library, and written in the JavaScript, TypeScript,
                            and Rust programming languages. <br />
                            <br />
                            Rauch is originally from Argentina, and has always
                            been involved in public projects for the web. He
                            felt that there was room for improvement on the{" "}
                            <URL
                                url="https://en.wikipedia.org/wiki/Front-end_web_development"
                                text="frontend layer"
                            />{" "}
                            of the web, and decided to write Next to try and
                            fill that gap.
                            <br />
                            <br />
                            You can take a look at{" "}
                            <URL
                                url="https://nextjs.org"
                                text="NextJS's own website"
                            />{" "}
                            here.
                        </p>
                    </div>
                </Box>
            </div>
        </div>
    </div>
);

export default Home;
