"use client"
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { dart } from "@codemirror/legacy-modes/mode/clike";
import { EditorView } from "@codemirror/view";
import init, { format } from "@wasm-fmt/dart_fmt";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";

//Components
import CopyToClipboard from "../UI/CopyToClipboard";

//Interface
interface Props {
    types: string[];
}

const Output = ({ types }: Props) => {

    if (types.length === 0) return null;

    return (
        <div className="col-span-7 lg:col-span-7 xxs:col-span-12">
            <h4 className="text-xl font-semibold text-gray-700 mb-5">Entity Class</h4>
            {types.map((item, i) => (
                <div key={i} className={`${(i === types.length - 1) ? "mt-5" : ""}`}>
                    <p className="text-sm text-gray-500 mb-2">Entity Class {i + 1}</p>
                    <div className="rounded-sm overflow-hidden border border-solid border-gray-200 relative">
                        <CodeMirror
                            key={i}
                            value={item}
                            readOnly
                            extensions={[
                                StreamLanguage.define(dart),
                                EditorView.lineWrapping
                            ]}
                            theme={vscodeLight}
                            style={{ borderRadius: "10px" }}
                        />
                        <CopyToClipboard item={item} />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Output;