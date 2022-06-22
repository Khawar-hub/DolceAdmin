import { firebase } from "./config";
import { userLogin } from "../Redux/Actions";


export const authSignIn = (email, password, dispatch, navigate, notify) => {
  const ref = firebase.firestore().collection(email=="admin@gmail.com"?"Admin":"Managers")
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;
      console.log(user)
      ref
        .doc(user.uid)
        .get()
        .then((doc) => {
          console.log(doc.data())
          if (doc.exists && doc.data().uid === user.uid) {
            dispatch(userLogin({ email: user.email, uid: user.uid }));
            navigate("/admin/home");
            notify("Logged in.");
          }else if(doc.exists&& doc.data().role=='manager'){
            console.log("CALLED")
            dispatch(userLogin({ email: user.email, uid: user.uid,role:doc.data().role }))
            navigate("/admin/home");
            notify("Logged in.");
          }
           else {
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