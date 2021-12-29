import {Form, Formik, FormikErrors, FormikHelpers} from 'formik';
import {useUser} from '../hooks/use-user';
import {UserLoadingState} from './UserContext';
import * as yup from "yup";
import {UserDocument} from "../model/UserDocument";
import {FiAlertTriangle, FiCheckCircle, FiInfo} from "react-icons/fi";
import {ReactNode, useEffect, useState} from "react";
import {FoundationInput} from "./formik/FoundationInput";
import {SubmitButton} from "./SubmitButton";

const schema = yup.object().shape({
    name: yup.string().required('Enter your name'),
    email: yup.string().email("Enter your email, e.g. name@example.org").required("Enter your email"),
    password: yup.string().min(12, "Enter a password of at least 12 characters"),
    old_password: yup.string()
        .min(12, "Enter a password of at least 12 characters")
        .required('Enter your current password to make changes to your account.'),
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
            icon = <FiInfo/>;
            break;
    }

    return <div className={`callout ${data.type}`}>
        {icon} {data.message}
    </div>
}

type ErrorResponse = { message?: string, field_errors?: FormikErrors<ProfileData> };

export const ProfileForm = () => {
    const {user, setUser, loadingState} = useUser();
    const [splash, setSplash] = useState<SplashMessageData | null>(null);

    useEffect(() => {
        if (splash !== null) {
            const timeout = window.setTimeout(() => setSplash(null), 5000)
            return () => window.clearTimeout(timeout);
        }
    })

    if (loadingState !== UserLoadingState.LOADED || !user) {
        return <p>Loading...</p>
    }

    const handleSubmit = ({name, email, old_password, password}: ProfileData, actions: FormikHelpers<ProfileData>) => {
        if (!name || !email || !old_password) {
            return;
        }

        const body = JSON.stringify({name, email, old_password, password});

        return fetch('/api/user', {
            method: 'PUT',
            body,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then((json: UserDocument | ErrorResponse) => {
                if ((json as ErrorResponse).field_errors || (json as ErrorResponse).message) {
                    const error = (json as ErrorResponse)
                    if (error.field_errors) {
                        actions.setErrors(error.field_errors);
                    }

                    if (error.message) {
                        setSplash({type: 'alert', message: error.message});
                    }
                } else if ((json as UserDocument)._id) {
                    setSplash({type: 'success', message: 'Your account has been updated.'})
                    setUser(json as UserDocument)
                } else {
                    throw new Error()
                }
            })
            .catch(() => setSplash({type: 'alert', message: 'There was an error updating your account.'}));
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
            <FoundationInput label="Confirm your current password to make changes:" type="password"
                             name="old_password"/>
            <hr/>
            <FoundationInput label="Name" type="text" name="name"/>
            <FoundationInput label="Email" type="text" name="email"/>
            <div className="callout info">
                <p><FiInfo/> Your password will remain unchanged if this is left blank.</p>
                <FoundationInput label="New Password" type="password" name="password"
                                 placeholder="Keep current password"/>
            </div>

            <SubmitButton label="Update"/>
        </Form>
    </Formik>
}
