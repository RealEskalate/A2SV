import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../../widgets/roundedInputField.dart';
import '../home/home.dart';

class ConfirmationPage extends StatelessWidget {
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
              SizedBox(height: size.height * 0.05),
              Center(
                  child: Material(
                // with Material
                child: Image.asset('assets/images/ephi.png',
                    width: 330, height: 80),

                clipBehavior: Clip.antiAlias,
              )),
              SizedBox(height: size.height * 0.1),
              Text('Enter Confirmation Code Sent To Your Email',
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
                hintText: "Confirmation Code",
                onChanged: (value) {},
              ),
              SizedBox(height: size.height * 0.05),
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
                          return Home();
                        },
                      ),
                    );
                  },
                  child: Text('Confirm',
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
