import '../../widgets/alreadyHaveAnAccountCheck.dart';
import '../../widgets/roundedInputField.dart';
import '../../widgets/roundedPasswordField.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../sign_up/createAccount.dart';

class LoginPage extends StatelessWidget {
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
              Text('Sign In To Your Account',
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
                    color: Colors.lightBlue,
                    fontSize: 20.0,
                  )),
              SizedBox(height: size.height * 0.05),
              RoundedInputField(
                hintText: "Email",
                onChanged: (value) {},
                icon: Icons.email,
              ),
              SizedBox(height: size.height * 0.02),
              RoundedPasswordField(onChanged: (value) {}),
              SizedBox(height: size.height * 0.02),
              AlreadyHaveAnAccountCheck(
                  color: Colors.grey[600],
                  login: true,
                  press: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) {
                        return CreateAccountPage();
                      }),
                    );
                  }),
              SizedBox(height: size.height * 0.05),
              SizedBox(height: size.height * 0.05),
              ButtonTheme(
                minWidth: size.width * 0.8,
                height: size.width * 0.15,
                child: RaisedButton(
                  color: Colors.lightBlue,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40)),
                  onPressed: () {
//                    Navigator.push(
//                      context,
//                      MaterialPageRoute(
//                        builder: (context) {
//                          return CreateAccountScreen();
//                        },
//                      ),
//                    );
                  },
                  child: Text('SIGN IN',
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
