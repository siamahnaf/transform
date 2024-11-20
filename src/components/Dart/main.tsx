"use client"
import { useState } from "react";
import Editor from "./Editor";
import Output from "./Output";

const Main = () => {
    const [entity, setEntity] = useState<string[]>([]);
    const [model, setModel] = useState<string[]>([]);

    return (
        <div className="grid grid-cols-12 lg:gap-12 xxs:gap-0 xxs:max-lg:gap-y-12 mt-12">
            <Editor
                setEntity={setEntity}
                setModel={setModel}
            />
            <Output
                entity={entity}
                model={model}
            />
        </div>
    );
};

export default Main;