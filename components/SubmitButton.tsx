import {FiLoader} from "react-icons/fi";
import {useFormikContext} from "formik";

interface SubmitButtonProps {
    label: string;
}

export function SubmitButton({label}: SubmitButtonProps) {
    const {isSubmitting} = useFormikContext()

    return <button className={`button primary ${isSubmitting ? "disabled" : ""}`}>
        {isSubmitting ? <FiLoader className="spin"/> : null} {label}
    </button>;
}
