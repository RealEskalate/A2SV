import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'dart:ui';
import '../pages/cases/cases.dart';
import '../pages/sign_in/login.dart';
import '../pages/people/people_home.dart';

class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Drawer(
      elevation: 90.0,
      child: Column(
        // padding: EdgeInsets.zero,
        children: <Widget>[
          Container(color: HexColor("#0a6dc9"), child: _createHeader()),
          Container(
            // color: Colors.amber[50],
            child: Column(
              children: <Widget>[
                _createDrawerItem(
                    icon: Icons.person, text: 'Profile', context: context),
                _createDrawerItem(
                    icon: Icons.settings, text: 'Settings', context: context),
                // _createDrawerItem(icon: Icons.bug_report, text: 'Bug Report'),
                Divider(),
                _createDrawerItem(
                    icon: Icons.info, text: 'About', context: context),
                _createDrawerItem(
                    icon: Icons.exit_to_app, text: 'Logout', context: context),
                SizedBox(height: size.height * 0.3),
                Column(
                  children: <Widget>[
                    Text('Beta version 0.1',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 12.0,
                        )),
                    Text('Eskalate™. 2020 All Rights Reserved.',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 12.0,
                        )),
                    Container(
                      height: 55,
                      decoration: BoxDecoration(
                          image: DecorationImage(
                              fit: BoxFit.contain,
                              image: AssetImage('assets/images/eskalate.png'))),
                    )
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _createHeader() {
    return DrawerHeader(
      margin: EdgeInsets.zero,
      padding: EdgeInsets.all(10),
      // decoration: BoxDecoration(
      //     image: DecorationImage(
      //         fit: BoxFit.contain,
      //         image: AssetImage('assets/images/ephi.png'))
      // ),
      child: Stack(
        children: <Widget>[
          Positioned(
            top: 110,
            left: 0,
            width: 310,
            height: 20,
            // Note: without ClipRect, the blur region will be expanded to full
            // size of the Image instead of custom size
            child: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 2, sigmaY: 2),
              ),
            ),
          ),
          Center(
              child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: <Widget>[
                SizedBox(width: 10),
                CircleAvatar(
                  backgroundImage: AssetImage('assets/images/user1.jpg'),
                  maxRadius: 25,
                ),
                SizedBox(width: 10),
                Text("Dr. Mike",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 25.0))
              ])),
        ],
      ),
    );
  }
}

Widget _createDrawerItem(
    {IconData icon,
    String text,
    GestureTapCallback onTap,
    BuildContext context}) {
  return ListTile(
    title: Row(
      children: <Widget>[
        Icon(icon),
        Padding(
          padding: EdgeInsets.only(left: 8.0),
          child: Text(text, style: TextStyle(color: Colors.black)),
        )
      ],
    ),
//    onTap: onTap,
    onTap: () {
      switch (text) {
        case "Settings":
          break;
        case "Profile":
          break;
        case "Logout":
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => LoginPage(),
            ),
          );
          break;
      }
    },
  );
}
