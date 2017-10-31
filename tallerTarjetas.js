var restify = require('restify');
var builder = require('botbuilder');

//Levantar restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//No te preocupes por estas credenciales por ahora, luego las usaremos para conectar los canales.
var connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

//Utilizamos un UniversalBot
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//Dialogos
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Bienvenido');
        session.endDialog();
        session.beginDialog('/Home');
    }
]);

bot.dialog('/Home', [
    
    function (session, results, next) {
        builder.Prompts.choice(session, '¿Que te interesa ver?', 'ThumbnailCard|VideoCard|HeroCard|AnimationCard|SignInCard|AudioCard|ReceiptCard|Nada', {listStyle: builder.ListStyle.button});
    },

    function (session, results) {
        session.conversationData.preferencia = results.response.entity;
        switch (session.conversationData.preferencia) {
            case 'ThumbnailCard':
                session.beginDialog('/Thumbnail');
            break;

            case 'VideoCard':
                session.beginDialog('/Video');
            break;

            case 'HeroCard':
                session.beginDialog('/Hero');
            break;

            case 'AnimationCard':
                session.beginDialog('/Animation');
            break;
            
            case 'SignInCard':
                session.beginDialog('/Signin');
            break;
                        
            case 'AudioCard':
                session.beginDialog('/Audio');
            break;
                        
            case 'ReceiptCard':
                session.beginDialog('/Receipt');
            break;  
                                    
            case 'Nada':
                session.endDialog('Hasta Pronto');
            break;               
        
            default:
                break;
        }
    },
    function (session, results) {
        builder.Prompts.choice(session, '¿Quieres ver algo más?', 'Continuar|Salir', {listStyle: builder.ListStyle.button});
    },
    function (session, results) {
        session.conversationData.seguir = results.response.entity;
        
        switch (session.conversationData.seguir) {
            case 'Continuar':
                session.beginDialog('/Home');
            break;

            case 'Salir':
                session.endConversation('Hasta Pronto');
            break;

            default:
                break;
        }
    }
]);

//Thumbnail
bot.dialog('/Thumbnail', [
    function (session) {
        var thumbnailCard = new builder.ThumbnailCard(session)
        .title('BotFramework Thumbnail Card')
        .subtitle('Your bots — wherever your users are talking')
        .text('Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.')
        .images([
            builder.CardImage.create(session, 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg')
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://docs.microsoft.com/bot-framework', 'Get Started')
        ]);

        // Adjuntamos la tarjeta
        var msj = new builder.Message(session).addAttachment(thumbnailCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Video
bot.dialog('/Video', [
    function (session) {
        var videoCard = new builder.VideoCard(session)
        .title('Big Buck Bunny')
        .subtitle('by the Blender Institute')
        .text('Big Buck Bunny (code-named Peach) is a short computer-animated comedy film by the Blender Institute, part of the Blender Foundation. Like the foundation\'s previous film Elephants Dream, the film was made using Blender, a free software application for animation made by the same foundation. It was released as an open-source film under Creative Commons License Attribution 3.0.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg'))
        .media([
            { url: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://peach.blender.org/', 'Learn More')
        ]);

        // Adjuntamos la tarjeta
        var msj = new builder.Message(session).addAttachment(videoCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Hero
bot.dialog('/Hero', [
    function (session) {
        var heroCard = new builder.HeroCard(session)
            .title('Microsoft')
            .subtitle('Bot Framewrok')
            .text('Mira aqui la documentacion para las rich card')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/media/hubs/botframework/bot-framework-developing-reference.svg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-send-rich-cards', 'Ir')
            ]);

        // Adjuntamos la tarjeta
        var msj = new builder.Message(session).addAttachment(heroCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Animation
bot.dialog('/Animation', [
    function (session) {
        var animationCard = new builder.AnimationCard(session)
        .title('It')
        .subtitle('Animation Card')
        .image(builder.CardImage.create(session))
        .media([
            { url: 'http://i0.kym-cdn.com/photos/images/newsfeed/001/293/317/1e5.gif' }
        ]);
        
        var msj = new builder.Message(session).addAttachment(animationCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Signin
bot.dialog('/Signin', [
    function (session) {
        var signInCard = new builder.SigninCard(session)
        .text('Logueate con Facebook')
        .button('Sign-in', 'https://en-gb.facebook.com/login/');
    
        // Adjuntamos la tarjeta
        var msj = new builder.Message(session).addAttachment(signInCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Audio
bot.dialog('/Audio', [
    function (session) {
        var audioCard = new builder.AudioCard(session)
        .title('I am your father')
        .subtitle('Star Wars: Episode V - The Empire Strikes Back')
        .text('The Empire Strikes Back (also known as Star Wars: Episode V – The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner. Leigh Brackett and Lawrence Kasdan wrote the screenplay, with George Lucas writing the film\'s story and serving as executive producer. The second installment in the original Star Wars trilogy, it was produced by Gary Kurtz for Lucasfilm Ltd. and stars Mark Hamill, Harrison Ford, Carrie Fisher, Billy Dee Williams, Anthony Daniels, David Prowse, Kenny Baker, Peter Mayhew and Frank Oz.')
        .image(builder.CardImage.create(session, 'https://upload.wikimedia.org/wikipedia/en/3/3c/SW_-_Empire_Strikes_Back.jpg'))
        .media([
            { url: 'http://www.wavlist.com/movies/004/father.wav' }
        ])
        .buttons([
            builder.CardAction.openUrl(session, 'https://en.wikipedia.org/wiki/The_Empire_Strikes_Back', 'Read More')
        ]);
        
        var msj = new builder.Message(session).addAttachment(audioCard);
        session.send(msj);
        session.endDialog();
    }
]);

//Receipt
bot.dialog('/Receipt', [
    function (session) {
        var receiptCard = new builder.ReceiptCard(session)
        .title('John Doe')
        .facts([
            builder.Fact.create(session, '1234', 'Order Number'),
            builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
        ])
        .items([
            builder.ReceiptItem.create(session, '$ 38.45', 'Data Transfer')
                .quantity(368)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png')),
            builder.ReceiptItem.create(session, '$ 45.00', 'App Service')
                .quantity(720)
                .image(builder.CardImage.create(session, 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png'))
        ])
        .tax('$ 7.50')
        .total('$ 90.95')
        .buttons([
            builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/pricing/', 'More Information')
                .image('https://raw.githubusercontent.com/amido/azure-vector-icons/master/renders/microsoft-azure.png')
        ]);

        // Adjuntamos la tarjeta
        var msj = new builder.Message(session).addAttachment(receiptCard);
        session.send(msj);
        session.endDialog();
    }
]);