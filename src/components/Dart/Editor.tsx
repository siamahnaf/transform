"use client";
import { useState, Dispatch, SetStateAction } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import Link from "next/link";
import Image from "next/image";

//Utils
import { camelCase } from "@/Utils/camelCase";
import { upperCamelCase } from "@/Utils/upperCamelCase";

//Components
import Select from "../UI/Select";

//Interface
interface Props {
    setEntity: Dispatch<SetStateAction<string[]>>;
    setModel: Dispatch<SetStateAction<string[]>>;
}

const Editor = ({ setEntity, setModel }: Props) => {
    const [jsonInput, setJsonInput] = useState<string>("");
    const [name, setName] = useState<string>("AutoGenerated");
    const [type, setType] = useState<string>("num");

    const handleChange = (value: any) => {
        setJsonInput(value);
    };

    //Handler
    const onReset = () => {
        setJsonInput("");
        setEntity([]);
        setModel([]);
    }

    //Handler
    const onGenerate = () => {
        try {
            const jsonObj = JSON.parse(jsonInput);
            const { entityClasses, modelClasses } = generateDartClasses(jsonObj, name);
            setEntity(entityClasses);
            setModel(modelClasses);
        } catch (error) {
            alert("The json provided has syntax errorsssss!");
        }
    }

    //Handler Helper
    const generateDartClasses = (jsonObj: any, className: string): { entityClasses: string[], modelClasses: string[] } => {
        if (Array.isArray(jsonObj) && jsonObj.length > 0) {
            jsonObj = jsonObj[0];
        }

        const entityFields: string[] = [];
        const modelFields: string[] = [];
        const toJsonFields: string[] = [];
        const fromJsonFields: string[] = [];
        const nestedEntities: string[] = [];
        const nestedModels: string[] = [];


        const processField = (key: string, value: any) => {
            const camelCaseKey = camelCase(key);
            const valueType = typeof value;

            if (Array.isArray(value) && value.length > 0) {
                const nestedClassName = `${upperCamelCase(camelCaseKey)}`;
                const nestedClass = generateDartClasses(value, nestedClassName);
                nestedEntities.push(...nestedClass.entityClasses);
                nestedModels.push(...nestedClass.modelClasses);
                entityFields.push(`final List<${nestedClassName}Model>? ${camelCaseKey};`);
                modelFields.push(`super.${camelCaseKey},`);
                toJsonFields.push(`'${key}': ${camelCaseKey}?.map((x) => x.toJson()).toList(),`);
                fromJsonFields.push(
                    `${camelCaseKey}: map['${key}'] != null ? List<${nestedClassName}Model>.from((map['${key}'] as List<dynamic>).map<${nestedClassName}Model?>((x) => ${nestedClassName}Model.fromJson(x as Map<String, dynamic>))) : null,`
                );
            } else if (valueType === 'object' && value !== null) {
                const nestedClassName = `${upperCamelCase(camelCaseKey)}`;
                const nestedClass = generateDartClasses(value, nestedClassName);
                nestedEntities.push(...nestedClass.entityClasses);
                nestedModels.push(...nestedClass.modelClasses);
                entityFields.push(`final ${nestedClassName}Model? ${camelCaseKey};`);
                modelFields.push(`super.${camelCaseKey},`);
                toJsonFields.push(`'${key}': ${camelCaseKey}?.toJson(),`);
                fromJsonFields.push(
                    `${camelCaseKey}: map['${key}'] != null ? ${nestedClassName}.fromJson(map['${key}'] as Map<String, dynamic>) : null,`
                );
            } else {
                let fieldType = '';
                if (valueType === 'number') {
                    if (type === "specific") {
                        fieldType = Number.isInteger(value) ? 'int' : 'double';
                    } else {
                        fieldType = "num";
                    }
                } else if (valueType === 'string') {
                    fieldType = 'String';
                } else if (valueType === 'boolean') {
                    fieldType = 'bool';
                } else {
                    fieldType = 'dynamic';
                }
                const nullableSuffix = fieldType === 'dynamic' ? '' : '?';
                entityFields.push(`final ${fieldType}${nullableSuffix} ${camelCaseKey};`);
                modelFields.push(`super.${camelCaseKey},`);
                toJsonFields.push(`'${key}': ${camelCaseKey},`);
                fromJsonFields.push(
                    `${camelCaseKey}: map['${key}'] != null ? map['${key}'] as ${fieldType} : null,`
                );
            }
        };

        for (const key in jsonObj) {
            processField(key, jsonObj[key]);
        }

        const entityClass = `class ${upperCamelCase(className)} {\n  ${entityFields.join('\n  ')}\n\n  ${upperCamelCase(className)}({\n    ${entityFields
            .map((field) => `this.${field.split('? ')?.[1]?.replace(';', ',')}`)
            .join('\n    ')}\n  });\n}`;

        const modelClass = `class ${upperCamelCase(className)}Model extends ${upperCamelCase(className)} {\n  ${upperCamelCase(className)}Model({\n    ${modelFields.join(
            '\n    '
        )}\n  });\n\n  Map<String, dynamic> toJson() {\n    return <String, dynamic>{\n      ${toJsonFields.join(
            '\n      '
        )}\n    };\n  }\n\n  factory ${upperCamelCase(className)}Model.fromJson(Map<String, dynamic> map) {\n    return ${upperCamelCase(className)}Model(\n      ${fromJsonFields.join(
            '\n      '
        )}\n    );\n  }\n}`;

        return { entityClasses: [entityClass, ...nestedEntities], modelClasses: [modelClass, ...nestedModels] };
    };

    return (
        <div className="col-span-5 lg:col-span-5 xxs:col-span-12">
            <h4 className="text-xl font-semibold text-gray-700 mb-2">JSON</h4>
            <div className="border border-solid border-gray-200 rounded-sm overflow-hidden">
                <CodeMirror
                    value={jsonInput}
                    height="400px"
                    extensions={[
                        json(),
                        autocompletion(),
                        EditorView.lineWrapping
                    ]}
                    onChange={handleChange}
                    placeholder="Enter JSON here..."
                    theme={vscodeLight}
                    style={{ borderRadius: "10px" }}
                />
            </div>
            <input
                className="w-full mt-5 py-3 px-4 focus:outline-none border border-solid border-gray-200 rounded-sm"
                placeholder="Your dart class name"
                onChange={(e) => setName(e.target.value)}
            />
            <h4 className="text-base text-gray-600 my-2">By default, this tool generate number type as num for both int and double. If you want to get specific type by detection, choose specific</h4>
            <Select
                id="selectType"
                value={type}
                onChange={(e) => setType(e)}
                placeholder="Select number type"
                options={[
                    { value: "num", label: "Num" },
                    { value: "specific", label: "Specific(Detection)" }
                ]}
            />
            <div className="grid grid-cols-2 gap-5 mt-4">
                <button className="bg-gray-700 text-white px-8 py-3 flex-1 rounded-sm" onClick={onReset}>Clear JSON</button>
                <button className="bg-main text-white py-3 rounded-sm" onClick={onGenerate}>
                    Generate Dart
                </button>
            </div>
            <div className="mt-32 text-center">
                <Image src="/logo.png" alt="Logo" width={502} height={133.93} className="w-[180px] mx-auto" />
                <div className="w-full mx-auto h-[6px] bg-main mt-6 rounded-sm my-4" />
                <h4 className="text-xl font-semibold text-gray-700">Created By Siam Ahnaf</h4>
                <Link href="https://www.siamahnaf.com/" target="_blank" className="text-[15px] text-main hover:underline">
                    www.siamahnaf.com
                </Link>
            </div>
        </div>
    );
};

export default Editor;
