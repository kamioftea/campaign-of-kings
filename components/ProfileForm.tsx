import {Field, Form, Formik} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {FiAlertTriangle, FiCheckCircle, FiInfo} from "react-icons/fi";
import {ReactNode, useEffect, useState} from "react";

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    old_password: yup.string().min(8).required(),
    password: yup.string().min(8),
})

interface ProfileData extends Partial<UserDocument> {
    old_password: string
}

interface SplashMessageData {
    type: 'alert' | 'warning' | 'success' | 'info',
    message: ReactNode,
}

function SplashMessage({data}: {data: SplashMessageData | null}) {
    if(!data) {
        return null;
    }

    let icon: ReactNode;
    switch (data.type) {
        case 'alert':
        case 'warning':
            icon = <FiAlertTriangle />;
            break;
        case 'success':
            icon = <FiCheckCircle/>;
            break;
        case 'info':
            icon = <FiInfo />;
            break;
    }

    return <div className={`callout ${data.type}`}>
        {icon} {data.message}
    </div>
}

export const ProfileForm = () => {
    const {user, setUser, loadingState, setLoadingState} = useUser();
    const [splash, setSplash] = useState<SplashMessageData | null>(null)

    useEffect(() => {
        if(splash !== null) {
            const timeout = window.setTimeout(() => setSplash(null), 5000)
            return () => window.clearTimeout(timeout);
        }
    })

    if (loadingState !== UserLoadingState.LOADED || !user) {
        return <p>Loading...</p>
    }

    const handleSubmit = ({name, email, old_password, password}: ProfileData) => {
        if (!name || !email || !old_password) {
            return;
        }

        setLoadingState(UserLoadingState.LOADING);

        const body = JSON.stringify({name, email, old_password, password});

        fetch('/api/user', {
            method: 'PUT',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.status === 200 ? res.json() : undefined)
            .then((json: UserDocument | undefined) => {
                setSplash({type: 'success', message: 'Your account has been updated.'})
                setUser(json)
            })
            .catch(() => setSplash({type: 'alert', message: 'There was an error updating your account.'}))
            .finally(() => setLoadingState(UserLoadingState.LOADED))
    }

    return <Formik
        initialValues={{
            old_password: '',
            name: user.name,
            email: user.email,
            password: '',
        }}
        validationSchema={schema}
        onSubmit={handleSubmit}
    >
        <Form>
            <SplashMessage data={splash}/>
            <div className="callout warning">
                <FiAlertTriangle/> Please confirm your current password to make changes to your account.
            </div>
            <label>
                Current Password
                <Field type="password" name="old_password"/>
            </label>
            <hr/>
            <label>
                Name
                <Field type="text" name="name"/>
            </label>
            <label>
                Email
                <Field type="text" name="email"/>
            </label>
            <div className="callout info">
                <FiInfo/> If you would like to update your password, enter a new password below. <br/>
                Your password will remain unchanged if this is left blank.
            </div>
            <label>
                Password
                <Field type="password" name="password"/>
            </label>
            <button className="button primary">Update</button>
        </Form>
    </Formik>
}
