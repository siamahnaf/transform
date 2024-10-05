"use client"
import { useState } from "react";

interface Props {
    item: string;
}

const CopyToClipboard = ({ item }: Props) => {
    //State
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(item).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 4000);
        });
    };

    return (
        <div className="absolute top-3 right-3">
            <button className={`p-1.5 rounded hover:bg-gray-100 ${copied ? "text-2xl text-green-600" : "text-lg"}`} onClick={handleCopyToClipboard}>
                {!copied ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path className="fill-green-600" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" /></svg>}
            </button>
            {copied &&
                <p className="absolute right-full bg-gray-700 text-white px-3 mr-2 py-1 rounded top-1/2 -translate-y-1/2">Copied</p>
            }
        </div>
    );
};

export default CopyToClipboard;