"use client";
import { useState, Dispatch, SetStateAction } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";
import camelCase from "camelcase";
import { eclipseInit } from "@uiw/codemirror-theme-eclipse";

//Components
import Select from "./Select";

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
            alert("The json provided has syntax errors!");
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
            const camelCaseKey = camelCase(key.replaceAll("@", ""));
            const valueType = typeof value;

            if (Array.isArray(value) && value.length > 0) {
                const nestedClassName = `${capitalize(camelCaseKey)}`;
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
                const nestedClassName = `${capitalize(camelCaseKey)}`;
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
                entityFields.push(`final ${fieldType}? ${camelCaseKey};`);
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

        const entityClass = `class ${className} {\n  ${entityFields.join('\n  ')}\n\n  ${className}({\n    ${entityFields
            .map((field) => `this.${field.split('? ')[1].replace(';', ',')}`)
            .join('\n    ')}\n  });\n}`;

        const modelClass = `class ${className}Model extends ${className} {\n  ${className}Model({\n    ${modelFields.join(
            '\n    '
        )}\n  });\n\n  Map<String, dynamic> toJson() {\n    return <String, dynamic>{\n      ${toJsonFields.join(
            '\n      '
        )}\n    };\n  }\n\n  factory ${className}Model.fromJson(Map<String, dynamic> map) {\n    return ${className}Model(\n      ${fromJsonFields.join(
            '\n      '
        )}\n    );\n  }\n}`;

        return { entityClasses: [entityClass, ...nestedEntities], modelClasses: [modelClass, ...nestedModels] };
    };

    //Helpers
    const capitalize = (str: string) => {
        return str.replaceAll("@", "").charAt(0).toUpperCase() + str.slice(1);
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
                    theme={eclipseInit({
                        settings: {
                            caret: "black"
                        }
                    })}
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
                <button className="bg-purple-600 text-white py-3 rounded-sm" onClick={onGenerate}>
                    Generate Dart
                </button>
            </div>
        </div>
    );
};

export default Editor;
