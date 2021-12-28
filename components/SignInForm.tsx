import {Field, Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import {useRouter} from "next/router";
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {useEffect} from "react";

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
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

        setLoadingState(UserLoadingState.LOADING);

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
            <label>
                Email
                <Field type="text" name="email"/>
            </label>
            <label>
                Password
                <Field type="password" name="password"/>
            </label>
            <button className="button primary">Sign In</button>
        </Form>
    </Formik>
}
