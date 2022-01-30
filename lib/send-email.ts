import { SESClient, SendEmailCommand, SendEmailCommandInput, SendEmailCommandOutput, Body} from '@aws-sdk/client-ses';

const client = new SESClient({region: 'eu-west-2'});

interface Email {
    to: string[],
    cc?: string[],
    bcc?: string[],
    subject: string
    html?: string,
    text?: string,
}

function toContent(data: string)  {
    return {
        Charset: 'UTF-8',
        Data: data
    }
}

export function sendEmail(email: Email): Promise<SendEmailCommandOutput> {
    const body: Body = {}
    if(email.html) {
        body.Html = toContent(email.html);
    }
    if(email.text) {
        body.Text = toContent(email.text);
    }

    const params: SendEmailCommandInput = {
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

    return client.send(new SendEmailCommand(params))
}
