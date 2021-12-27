import {Field, Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import {useRouter} from "next/router";
import * as yup from "yup";
import {UserDocument} from "../model/User";
import {useEffect} from "react";

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
})

export const SignUpForm = () => {
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

    const handleSubmit = ({name, email , password}: Partial<UserDocument>) => {
        if(!name || !email || ! password) {
            return;
        }

        setLoadingState(UserLoadingState.LOADING);

        const body = JSON.stringify({name, email, password});

        fetch('/api/user', {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.status === 201 ? res.json() : undefined)
            .then((json: { user: UserDocument } | undefined) => setUser(json?.user))
            .finally(() => setLoadingState(UserLoadingState.LOADED))
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
            <label>
                Name
                <Field type="text" name="name" />
            </label>
            <label>
                Email
                <Field type="text" name="email"/>
            </label>
            <label>
                Password
                <Field type="password" name="password"/>
            </label>
            <button className="button primary">Sign Up</button>
        </Form>
    </Formik>
}
