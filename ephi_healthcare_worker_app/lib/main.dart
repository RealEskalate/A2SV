// This application is developed for ethiopian public health institute and Healthcare Workers.
// Made with ❤ since 2019 in Ethiopia, Turkey and USA by the Eskalate team.
// Eskalate LLC is a American company.
// Copyright © 2020 Eskalate. All rights reserved.
// Mobile Team

// Main Themes for Both Anroid and IOS Devices
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

// Welcome Page
import 'pages/welcome.dart';

void main() => runApp(MaterialApp(
      // Sets a font as the default globally
      theme: ThemeData(fontFamily: 'Comfortaa'),
      debugShowCheckedModeBanner: false,
      home: Main(),
));

class Main extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.amber[50],
        body: WelcomePage(),
//        appBar: AppBar(
//          title: Text("EPHI Healthcare Workers App"),
//          centerTitle: true,
//          backgroundColor: Colors.blue,)
    );
  }
}
