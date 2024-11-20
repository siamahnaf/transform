import Link from "next/link";

import Main from "@/components/Typescript/mains";

const Page = () => {
    return (
        <div className="p-12 lg:p-12 xxs:p-5">
            <div className="text-center">
                <h5 className="text-4xl lg:text-4xl xxs:text-3xl font-semibold text-gray-800">JSON to Typescript</h5>
                <p className="mt-1.5">Paste your JSON in the json editor below, click generate type and get your <br /> typescript types for free.</p>
                <Link className=" text-main rounded-sm px-4 py-1.5 block mt-2 w-max mx-auto" href="/">
                    Try JSON to Dart
                </Link>
            </div>
            <Main />
        </div>
    );
};

export default Page;