import {InputHTMLAttributes, useEffect, useState} from "react";
import {FiCheck} from "react-icons/fi";

export interface SaveableInputProps extends InputHTMLAttributes<HTMLInputElement> {
    onSave: (value: string) => void
}

export function SaveableInput({onSave, value, ...props}: SaveableInputProps) {
    const [current, setCurrent] = useState<string>(value?.toString() ?? '');
    useEffect(() => setCurrent(value?.toString() ?? ''),[value])

    const handleSave = () => onSave(current)

    return <div className="input-group">
        <input {...props} value={current} onChange={e => { e.preventDefault(); setCurrent(e.currentTarget.value)}}/>
        <div className="input-group-button">
            <button className={`button primary small`}
                    onClick={handleSave}
                    onKeyPress={handleSave}
            >
                <FiCheck/>
            </button>
        </div>
    </div>
}
