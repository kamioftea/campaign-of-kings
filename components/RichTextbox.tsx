import {useEffect, useState} from "react";
import ReactMde, {SaveImageHandler} from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import {uploadFile} from "../lib/uploadFile";

export interface RichTextboxProps {
    value: string,
    onSave: (html: string) => void
}

export function RichTextbox({value, onSave}: RichTextboxProps) {
    const [currentValue, setCurrentValue] = useState<string>(value);
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    useEffect(() => {
        setCurrentValue(value);
    }, [value])

    const handleSave = () => onSave(currentValue);

    const saveImage: SaveImageHandler = async function* (data, file) {


        try {
            const {url} = await uploadFile(file);
            yield url;

            return true;
        } catch (err) {
            console.error(err)
            return false;
        }
    }

    return <>
        <ReactMde
            value={currentValue}
            onChange={setCurrentValue}
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            generateMarkdownPreview={(markdown) =>
                Promise.resolve(<ReactMarkdown >{markdown}</ReactMarkdown>)
            }
            childProps={{
                writeButton: {
                    tabIndex: -1
                }
            }}
            paste={{saveImage}}
        />
        <div className="align-right">
            <button className="button primary" onClick={handleSave} onKeyPress={handleSave}>Save</button>
        </div>
    </>
}
