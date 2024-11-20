import Link from "next/link";

//Components
import Main from "@/components/Dart/main";

const Page = () => {
  return (
    <div className="p-12 lg:p-12 xxs:p-5">
      <div className="text-center">
        <h5 className="text-4xl lg:text-4xl xxs:text-3xl font-semibold text-gray-800">JSON to Dart Model</h5>
        <p className="mt-1.5">Paste your JSON in the json editor below, click generate dart and get your <br /> dart  model and entity classes for free.</p>
        <Link className=" text-main rounded-sm px-4 py-1.5 block mt-2 w-max mx-auto" href="/json-to-typescript">
          Try JSON to Typescript
        </Link>
      </div>
      <Main />
    </div>
  );
};

export default Page;