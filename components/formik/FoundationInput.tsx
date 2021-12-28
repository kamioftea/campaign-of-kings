import {FieldHookConfig, useField} from "formik";
import {HTMLProps} from "react";

export function FoundationInput<T = any>({
                                             label,
                                             ...props
                                         }: HTMLProps<HTMLInputElement> & FieldHookConfig<T>) {
    const [field, meta] = useField(props);
    const hasError = meta.touched && meta.error
    props.className = `${props.className} ${hasError ? 'is-invalid-input' : ''}`

    return (
        <label className={hasError ? "is-invalid-label" : undefined}>
            {label}
            <input {...field} {...props} />
            {hasError
                ? <span className="form-error is-visible" role="alert">
                    {meta.error}
                  </span>
                : null
            }
        </label>
    );
}
