import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'dart:ui';

class AppDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          Container(color: Colors.white, child: _createHeader()),
          Container(
            // color: Colors.amber[50],
            child: Column(
              children: <Widget>[
                _createDrawerItem(icon: Icons.airline_seat_flat, text: 'Cases'),
                _createDrawerItem(icon: Icons.face, text: 'People'),
                _createDrawerItem(icon: Icons.person, text: 'Profile'),
                _createDrawerItem(icon: Icons.settings, text: 'Settings'),
                _createDrawerItem(icon: Icons.bug_report, text: 'Bug Report'),
                Divider(),
                _createDrawerItem(icon: Icons.info, text: 'About'),
                _createDrawerItem(icon: Icons.exit_to_app, text: 'Logout'),
                SizedBox(height: size.height * 0.05),
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
      padding: EdgeInsets.zero,
      // decoration: BoxDecoration(
      //     image: DecorationImage(
      //         fit: BoxFit.contain,
      //         image: AssetImage('assets/images/ephi.png'))
      // ),
      child: Stack(
        children: <Widget>[
          // Positioned(
          //   top: 110,
          //   left: 0,
          //   width: 310,
          //   height: 40,
          //   // Note: without ClipRect, the blur region will be expanded to full
          //   // size of the Image instead of custom size
          //   child: ClipRect(
          //     child: BackdropFilter(
          //       filter: ImageFilter.blur(sigmaX: 2, sigmaY: 2),
          //       child: Container(
          //         color: Colors.black.withOpacity(0.2),
          //       ),
          //     ),
          //   ),
          // ),
          Positioned(
              bottom: 12.0,
              left: 16.0,
              child: Text("EPHI Menu",
                  style: TextStyle(color: Colors.black, fontSize: 30.0))),
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
          child: Text(text),
        )
      ],
    ),
//    onTap: onTap,
    onTap: () {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => null,
        ),
      );
    },
  );
}
