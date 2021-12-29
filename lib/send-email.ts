import AWS, {AWSError, SES} from 'aws-sdk';
import {PromiseResult} from "aws-sdk/lib/request";
import Process from "process";

AWS.config.update({region: 'eu-west-2'});

interface Email {
    to: string[],
    cc?: string[],
    bcc?: string[],
    subject: string
    html?: string,
    text?: string,
}

function toContent(data: string): SES.Types.Content {
    return {
        Charset: 'UTF-8',
        Data: data
    }
}

export function sendEmail(email: Email): Promise<PromiseResult<SES.Types.SendEmailResponse, AWSError>> {
    const body: SES.Types.Body = {}
    if(email.html) {
        body.Html = toContent(email.html);
    }
    if(email.text) {
        body.Text = toContent(email.text);
    }

    const params: SES.Types.SendEmailRequest = {
        Source: 'jeff@goblinoid.co.uk',
        ReplyToAddresses: [
            'jeff@goblinoid.co.uk'
        ],
        Destination: {
            ToAddresses: email.to,
            CcAddresses: email.cc,
            BccAddresses: email.bcc,
        },
        Message: {
            Subject: toContent(email.subject),
            Body: body,
        },
    };


    console.log('config', AWS.config.accessKeyId);
    console.log('env', Process.env.AWS_ACCESS_KEY_ID)

    return new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
}
