var functions = require('firebase-functions');
var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase)

exports.createUser = functions.database.ref('/userTemp/{PushId}').onWrite(event => {

    let userdata = event.data.val();
    let key = event.params.key;
    let root = event.data.ref.root;

    if (!userdata || userdata.userCreated) {
        return
    }


    return admin.auth().createUser({
            email: userdata.uname + '@the-wire.com',
            emailVerified: true,
            password: userdata.pass,
            displayName: userdata.uname,
            photoURL: "https://previews.123rf.com/images/imagevectors/imagevectors1606/imagevectors160600225/58872992-Blanco-Perfil-de-usuario-icono-en-el-bot-n-azul-aislado-en-blanco-Foto-de-archivo.jpg",
            disabled: false
        })
        .then(function(userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.

            console.log("Successfully created new user:", userRecord.uid);
            let userobj = {
                "username": userdata.uname,
                "type": userdata.utype,
                "details": userdata.udetails
            }
            userdata = null;

            const a = root.child('/Users/' + userRecord.uid).set(userobj);
            const b = event.data.ref.set(userdata);

            return Promise.all([a, b])


        })
        .catch(function(error) {
            console.log("Error creating new user:", error);
        });

})