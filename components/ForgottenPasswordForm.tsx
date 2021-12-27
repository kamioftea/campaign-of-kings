import {Field, Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import {useRouter} from "next/router";
import * as yup from "yup";
import {UserDocument} from "../model/User";
import {useEffect, useState} from "react";
import Link from 'next/link';

const schema = yup.object().shape({
    email: yup.string().email().required()
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
        console.log('submit', email)
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
                <label>
                    Email
                    <Field type="text" name="email"/>
                </label>
                <button className="button primary">Request Reset</button>
            </Form>
        </Formik>
    </>
}
