import {Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import {useRouter} from "next/router";
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {useEffect} from "react";
import {FoundationInput} from "./formik/FoundationInput";
import {SubmitButton} from "./SubmitButton";

const schema = yup.object().shape({
    email: yup.string().email("Enter your email, e.g. name@example.org").required("Enter your email"),
    password: yup.string().min(12, "Enter a password of at least 12 characters").required("Enter your password")
})

export const SignInForm = () => {
    const {user, setUser, loadingState, setLoadingState} = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            // noinspection JSIgnoredPromiseFromCall
            router.push("/");
        }
    }, [user])

    if (loadingState !== UserLoadingState.LOADED) {
        return <p>Loading...</p>
    }

    const handleSubmit = ({ email , password}: Partial<UserDocument>) => {
        if(!email || !password) {
            return;
        }

        const body = JSON.stringify({email, password});

        fetch('/api/sign-in', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.status === 200 ? res.json() : undefined)
            .then((json: UserDocument | undefined) => setUser(json))
            .finally(() => setLoadingState(UserLoadingState.LOADED))
    }

    return <Formik
        initialValues={{
            email: '',
            password: '',
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
    >
        <Form>
            <FoundationInput label="Email" type="text" name="email"/>
            <FoundationInput label="Password" type="password" name="password"/>
            <SubmitButton label="Sign In" />
        </Form>
    </Formik>
}
