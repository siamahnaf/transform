import Main from "@/components/main";
import Link from "next/link";

const Page = () => {
  return (
    <div className="p-12">
      <div className="text-center">
        <h5 className="text-4xl font-semibold text-gray-800">JSON to Dart Model</h5>
        <p className="mt-1.5">Paste your JSON in the json editor below, click generate dart and get your <br /> dart  model and entity classes for free.</p>
      </div>
      <Main />
      <div className="mt-72 text-center">
        <h4 className="text-xl font-semibold text-gray-700">Created By Siam Ahnaf</h4>
        <div className="flex gap-4 justify-center mt-2 [&_a]:text-sm">
          <Link href="https://github.com/siamahnaf" className="text-purple-400 font-semibold">
            Github
          </Link>
          <Link href="https://github.com/siamahnaf/json-to-dart" className="text-purple-400 font-semibold">
            Repository
          </Link>
          <Link href="https://api.whatsapp.com/message/UAXIYNES562EN1" className="text-purple-400 font-semibold" >
            Whatsapp
          </Link>
        </div>
      </div>
      <div className="w-[300px] mx-auto h-[10px] bg-purple-600 mt-6 rounded-sm" />
    </div>
  );
};

export default Page;