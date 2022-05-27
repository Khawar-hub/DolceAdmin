import { firebase } from "./config";
import { userLogin } from "../Redux/Actions";

const ref = firebase.firestore().collection("Admin");

export const authSignIn = (email, password, dispatch, navigate, notify) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      ref
        .doc(user.uid)
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().uid === user.uid) {
            dispatch(userLogin({ email: user.email, uid: user.uid }));
            navigate("/admin/home");
            notify("Logged in.");
          } else {
            console.log("No such document!");
            notify("Incorrect email or password", {
              variant: "error",
            });
            firebase.auth().signOut();
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    })
    .catch((error) => {
      //   var errorCode = error.code;
      var errorMessage = error.message;
      notify(errorMessage, {
        variant: "error",
      });
    });
};