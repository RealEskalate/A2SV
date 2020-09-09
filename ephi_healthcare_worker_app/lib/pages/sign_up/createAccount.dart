import '../../widgets/alreadyHaveAnAccountCheck.dart';
import '../../widgets/roundedButton.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Components
import '../../widgets/roundedPasswordField.dart';
import '../../widgets/roundedInputField.dart';
import '../sign_in/login.dart';
import '../home/home.dart';
//import 'package:email_validator/email_validator.dart';

class CreateAccountPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Provides us total height and width of our screen
    Size size = MediaQuery.of(context).size;
    return Scaffold(
//      backgroundColor: Colors.amber[50],
      backgroundColor: Colors.white,
//      appBar: AppBar(
//        title: Text('Gazetem Mobil Uygulaması'),
//        centerTitle: true,
//        backgroundColor: Colors.redAccent,
//      ),
      body: Center(
        child: Padding(
          padding: EdgeInsets.all(30.0),
          child: Column(
            children: <Widget>[
              SizedBox(height: size.height * 0.03),
              Text('Create Healtcare Worker Account',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    shadows: <Shadow>[
                      Shadow(
                        offset: Offset(2.0, 2.0),
                        blurRadius: 7.0,
                        color: Color.fromARGB(45, 0, 0, 0),
                      ),
                    ],
//                    color: Colors.lightBlue,
                    color: Colors.lightGreenAccent[700],
                    fontSize: 20.0,
                  )),
              SizedBox(height: size.height * 0.05),
              RoundedInputField(
                signIn: false,
                hintText: "Healthcare Worker Full Name",
                onChanged: (value) {},
              ),
              SizedBox(height: size.height * 0.02),
              RoundedInputField(
                signIn: false,
                hintText: "Email",
                onChanged: (value) {},
                icon: Icons.email,
              ),
              SizedBox(height: size.height * 0.02),
              RoundedPasswordField(onChanged: (value) {}, signIn: false),
              SizedBox(height: size.height * 0.02),
              AlreadyHaveAnAccountCheck(
                  color: Colors.grey[600],
                  login: false,
                  press: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) {
                        return LoginPage();
                      }),
                    );
                  }),
              SizedBox(height: size.height * 0.05),
              // RoundedButton(
              //     color: Colors.lightGreenAccent[700],
              //     text: "CREATE ACCOUNT",
              //     press: () {}),
              ButtonTheme(
                minWidth: size.width * 0.8,
                height: size.width * 0.15,
                child: RaisedButton(
                  color: Colors.lightGreenAccent[700],
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40)),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) {
                          return Home();
                        },
                      ),
                    );
                  },
                  child: Text('CREATE ACCOUNT',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                      )),
                ),
              ),
              SizedBox(height: size.height * 0.025),
            ],
          ),
        ),
      ),
    );
  }
}

//class CreateAccountPage extends StatefulWidget {
//  @override
//  _CreateAccountPage createState() => _CreateAccountPage();
//}

//class _CreateAccountPage extends State<CreateAccountPage> {
//  final formKey = GlobalKey<FormState>();
//  final scaffoldKey = GlobalKey<ScaffoldState>();
//
//  String _email;
//  String _password;
//
//  void _submitCommand() {
//    final form = formKey.currentState;
//
//    if (form.validate()) {
//      form.save();
//
//      // Email & password matched our validation rules
//      // and are saved to _email and _password fields.
//      _loginCommand();
//    }
//  }
//
//  void _loginCommand() {
//    // This is just a demo, so no actual login here.
//    final snackbar = SnackBar(
//      content: Text('Email: $_email, password: $_password'),
//    );
//
//    scaffoldKey.currentState.showSnackBar(snackbar);
//  }
//
//  @override
//  Widget build(BuildContext context) {
//    return Scaffold(
//      key: scaffoldKey,
//      appBar: AppBar(
//        title: Text('Email validation example'),
//      ),
//      body: Padding(
//        padding: const EdgeInsets.all(16.0),
//        child: Form(
//          key: formKey,
//          child: Column(
//            children: [
//              TextFormField(
//                decoration: InputDecoration(labelText: 'Email'),
//                validator: (val) => !EmailValidator.validate(val, true)
//                    ? 'Not a valid email.'
//                    : null,
//                onSaved: (val) => _email = val,
//              ),
//              TextFormField(
//                decoration: InputDecoration(labelText: 'Password'),
//                validator: (val) =>
//                val.length < 4 ? 'Password too short..' : null,
//                onSaved: (val) => _password = val,
//                obscureText: true,
//              ),
//              RaisedButton(
//                onPressed: _submitCommand,
//                child: Text('Sign in'),
//              ),
//            ],
//          ),
//        ),
//      ),
//    );
//  }
//}
