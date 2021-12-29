import {Form, Formik} from 'formik';
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {FoundationInput} from "./formik/FoundationInput";
import {SubmitButton} from "./SubmitButton";
import {useResetKey} from "../hooks/use-reset-key";
import {FiAlertTriangle} from "react-icons/fi";
import Link from 'next/link';

const schema = yup.object().shape({
    password: yup.string().min(12, "Enter a password of at least 12 characters").required("Enter a password")
})

export const ResetPasswordForm = () => {
    const {user, isLoading, error, resetPassword} = useResetKey();

    if (isLoading) {
        return <p>Loading...</p>
    }

    if(error || !user) {
        return <>
            <div className="callout alert">
            <FiAlertTriangle/> {error ?? 'This password reset link is invalid, please request a new one.'}
        </div>
            <Link href={'/'}><a>Return to Homepage.</a></Link>
            </>
    }

    const handleSubmit = ({ password}: Partial<UserDocument>) => {
        if(!password) {
            return;
        }

        return resetPassword(password);
    }

    return <Formik
        initialValues={{
            password: '',
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
    >
        <Form>
            <p>
                Please enter a new password for<br />
                <strong>{user.name} ({user.email})</strong>
            </p>
            <input type="hidden" name="email" value={user.email}/>
            <FoundationInput label="Password" type="password" name="password"/>
            <SubmitButton label="Reset Password" />
        </Form>
    </Formik>
}
