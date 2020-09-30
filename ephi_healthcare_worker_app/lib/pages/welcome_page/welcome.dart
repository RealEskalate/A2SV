import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Login Page
import '../sign_up/createAccount.dart';
import '../sign_in/login.dart';

class WelcomePage extends StatelessWidget {
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
              SizedBox(height: size.height * 0.1),
              Center(
                child: Material(
                  // with Material
                  child: Image.asset('assets/images/ephi.png',
                      width: 330, height: 80),

                  clipBehavior: Clip.antiAlias,
                ),
              ),
              SizedBox(height: size.height * 0.1),
//              Image.asset('assets/images/eskalate.png', width: 230, height: 230),
              Text(
//                  'Ethiopian Public Health Institute COVID-19 Application',
                  'Ethiopian Public Health Institute',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    shadows: <Shadow>[
                      Shadow(
                        offset: Offset(2.0, 2.0),
                        blurRadius: 7.0,
                        color: Color.fromARGB(45, 0, 0, 0),
                      ),
                    ],
                    color: Colors.lightBlue,
                    fontSize: 25.0,
                  )),

              SizedBox(height: size.height * 0.18),
              ButtonTheme(
                minWidth: size.width * 0.8,
                height: size.width * 0.13,
                child: RaisedButton(
                  color: Colors.lightGreenAccent[700],
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40)),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) {
                          return CreateAccountPage();
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
              SizedBox(height: size.height * 0.02),
              ButtonTheme(
                minWidth: size.width * 0.8,
                height: size.width * 0.13,
                child: RaisedButton(
                  color: Colors.lightBlue,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(40)),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) {
                          return LoginPage();
                        },
                      ),
                    );
                  },
                  child: Text('SIGN IN',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16.0,
                      )),
                ),
              ),
              SizedBox(height: size.height * 0.02),
              Image.asset(
                'assets/images/eskalate.png',
                width: size.width * 0.8,
                height: size.height * 0.15,
                fit: BoxFit.contain,
              ),
              Text('Eskalate LLC™. 2020 All Rights Reserved.',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.black,
                    fontSize: 12.0,
                  )),
            ],
          ),
        ),
      ),
    );
  }
}
