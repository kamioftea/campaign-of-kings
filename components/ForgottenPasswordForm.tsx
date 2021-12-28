import {Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import {useRouter} from "next/router";
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {useEffect, useState} from "react";
import Link from 'next/link';
import {FoundationInput} from "./formik/FoundationInput";
import {SubmitButton} from "./SubmitButton";

const schema = yup.object().shape({
    email: yup.string().email("Enter your email, e.g. name@example.org").required("Enter your email"),
})

export const ForgottenPasswordForm = () => {
    const {user, loadingState} = useUser();
    const router = useRouter();
    const [submitted, setSubmitted] = useState<boolean>(false)
    useEffect(() => {
        if (user) {
            // noinspection JSIgnoredPromiseFromCall
            router.push("/");
        }
    }, [user])

    if (loadingState !== UserLoadingState.LOADED) {
        return <p>Loading...</p>
    }

    const handleSubmit = ({email}: Partial<UserDocument>) => {
        if (!email) {
            return;
        }

        const body = JSON.stringify({email});

        fetch('/api/forgotten-password', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => setSubmitted(res.status === 200));
    }

    if (submitted) {
        return <>
            <h1>Password Reset Sent</h1>
            <p>
                If we have an account with that email address, you should receive a link to reset your password shortly.
            </p>
            <p><Link href="/"><a>Return to Homepage...</a></Link></p>
        </>
    }

    return <>
        <h1>Reset Password</h1>
        <Formik
            initialValues={{
                email: '',
            }}
            validationSchema={schema}
            onSubmit={handleSubmit}
        >
            <Form>
                <FoundationInput label="Email" type="text" name="email"/>
                <SubmitButton label="Request Reset" />
            </Form>
        </Formik>
    </>
}
