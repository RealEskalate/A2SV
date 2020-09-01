import 'package:ephi_healthcare_worker_app/components/alreadyHaveAnAccountCheck.dart';
import 'package:ephi_healthcare_worker_app/components/roundedButton.dart';
import 'package:ephi_healthcare_worker_app/components/roundedInputField.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'homePage.dart';

class ConfirmationPage extends StatelessWidget {
  // String confirmationCode = "";
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
              Text('Confirmation Code',
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
              SizedBox(height: size.height * 0.25),
              Text('Enter the code sent to your email',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey[800],
                    fontSize: 18.0,
                  )),
              SizedBox(height: size.height * 0.05),
              RoundedInputField(
                signIn: true,
                hintText: "Confirmation Code",
                onChanged: (value) {},
                icon: Icons.check,
              ),
              SizedBox(height: size.height * 0.02),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text(
                    "Didn't get the code ? ",
                    style: TextStyle(color: Colors.grey),
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: Text(
                      "Resend",
                      style: TextStyle(
                        color: Colors.lightBlue,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                ],
              ),
              SizedBox(height: size.height * 0.25),
              RoundedButton(
                  color: Colors.lightBlue,
                  text: "CONFIRM",
                  press: () {
                    // No go back
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(builder: (context) => Home()),
                      (Route<dynamic> route) => false,
                    );
                  }),
//               ButtonTheme(
//                 minWidth: size.width * 0.8,
//                 height: size.width * 0.15,
//                 child: RaisedButton(
//                   color: Colors.lightBlue,
//                   shape: RoundedRectangleBorder(
//                       borderRadius: BorderRadius.circular(40)),
//                   onPressed: () {
// //                    Navigator.push(
// //                      context,
// //                      MaterialPageRoute(
// //                        builder: (context) {
// //                          return CreateAccountScreen();
// //                        },
// //                      ),
// //                    );
//                   },
//                   child: Text('CONFIRM',
//                       textAlign: TextAlign.center,
//                       style: TextStyle(
//                         color: Colors.white,
//                         fontSize: 16.0,
//                       )),
//                 ),
//               ),
            ],
          ),
        ),
      ),
    );
  }
}
