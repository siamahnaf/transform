"use client"
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { StreamLanguage } from "@codemirror/language";
import { dart } from "@codemirror/legacy-modes/mode/clike";
import { EditorView } from "@codemirror/view";
import init, { format } from "@wasm-fmt/dart_fmt";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";

//Components
import CopyToClipboard from "./CopyToClipboard";

//Interface
interface Props {
    entity: string[];
    model: string[];
}

const Output = ({ entity, model }: Props) => {

    const [formattedEntities, setFormattedEntities] = useState<string[]>([]);
    const [formattedModels, setFormattedModels] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const formatItems = async () => {
            await init();

            const formattedEntityPromises = entity.map(async (item) => {
                try {
                    const formatted = await format(item, "main.dart");
                    setErrorMessage("")
                    return formatted;
                } catch (error) {
                    setErrorMessage("There is formatting issue on this dart code");
                    return item;
                }
            });

            const formattedModelPromises = model.map(async (item) => {
                try {
                    const formatted = await format(item, "main.dart");
                    setErrorMessage("")
                    return formatted;
                } catch (error) {
                    setErrorMessage("There is formatting issue on this dart code");
                    return item;
                }
            });

            const formattedEntities = await Promise.all(formattedEntityPromises);
            const formattedModels = await Promise.all(formattedModelPromises);

            setFormattedEntities(formattedEntities);
            setFormattedModels(formattedModels);
        };

        formatItems();
    }, [entity, model]);

    if (formattedEntities.length === 0 && formattedModels.length === 0) return null;

    return (
        <div className="col-span-7 lg:col-span-7 xxs:col-span-12">
            {errorMessage &&
                <h4 className="font-semibold text-red-600 text-xl mb-5">{errorMessage}</h4>
            }
            <h4 className="text-xl font-semibold text-gray-700 mb-5">Entity Class</h4>
            {formattedEntities.map((item, i) => (
                <div key={i} className={`${(i === entity.length - 1) ? "mt-5" : ""}`}>
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
            <h4 className="text-xl font-semibold text-gray-700 mb-5 mt-12">Model Class</h4>
            {formattedModels.map((item, i) => (
                <div key={i} className={`${(i === entity.length - 1) ? "mt-5" : ""}`}>
                    <p className="text-sm text-gray-500 mb-2">Model class {i + 1}</p>
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