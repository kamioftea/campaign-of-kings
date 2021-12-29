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
    name: yup.string().required('Enter your name'),
    email: yup.string().email("Enter your email, e.g. name@example.org").required("Enter your email"),
    password: yup.string().min(12, "Enter a password of at least 12 characters").required("Enter a password"),
})

export const SignUpForm = () => {
    const {user, setUser, loadingState} = useUser();
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

    const handleSubmit = ({name, email , password}: Partial<UserDocument>) => {
        if(!name || !email || ! password) {
            return;
        }

        const body = JSON.stringify({name, email, password});

        return fetch('/api/user', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.status === 201 ? res.json() : undefined)
            .then((json: UserDocument | undefined) => setUser(json))
    }

    return <Formik
        initialValues={{
            name: '',
            email: '',
            password: '',
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
    >
        <Form>
            <FoundationInput label="Name" type="text" name="name"/>
            <FoundationInput label="Email" type="text" name="email"/>
            <FoundationInput label="Password" type="password" name="password"/>
            <SubmitButton label="Sign Up" />
        </Form>
    </Formik>
}
