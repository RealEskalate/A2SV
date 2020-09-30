import '../symptoms/symptom_home.dart';
import '../../widgets/blurredDrawer.dart';
import '../../widgets/currentPages.dart';
import '../cases/cases.dart';
import '../people/people_home.dart';
import 'package:ephi_healthcare_worker_app/widgets/drawer.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

import 'homePage.dart';

// Drawer Widget
class Home extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _HomeState();
  }
}

class _HomeState extends State<Home> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    // CurrentWidgets(Colors.blueGrey[100]),
    HomePage(),
    CasesList(),
    SymptomView(),
    PatientsHome()
  ];
  final List<String> _titles = ["Home", "Cases", "Symptoms", "Patients"];

  @override
  Widget build(BuildContext context) {
    // Size size = MediaQuery.of(context).size;
    return Scaffold(
      drawerScrimColor: Colors.black.withOpacity(0.2),
      // drawerScrimColor: Colors.transparent,
      drawer: BlurredDrawer(),
      appBar: AppBar(
        elevation: 1,
        backgroundColor: Colors.white,
        iconTheme: new IconThemeData(color: Colors.black),
        title: Center(
          child: Text(
            _titles[_currentIndex],
            style: TextStyle(
              color: Colors.grey,
            ),
          ),
        ),
      ),
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: onTabTapped,
        type: BottomNavigationBarType.shifting,
        // this will be set when a new tab is tapped
        unselectedItemColor: Colors.grey,
        selectedItemColor: HexColor("#0a6dc9"),
        currentIndex: _currentIndex,
        items: [
          BottomNavigationBarItem(
            icon: new Icon(
              Icons.home,
            ),
            title: new Text(
              'Home',
              style: TextStyle(),
            ),
          ),
          BottomNavigationBarItem(
            icon: new Icon(
              Icons.library_books,
            ),
            title: new Text(
              'Cases',
              style: TextStyle(),
            ),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.add_alert),
              title: Text(
                'Symptoms',
                style: TextStyle(),
              )),
          BottomNavigationBarItem(
              icon: Icon(Icons.people),
              title: Text(
                'Patients',
                style: TextStyle(),
              ))
        ],
      ),
    );
  }

  void onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }
}

// Center(
// child: Padding(
// padding: EdgeInsets.all(30.0),
// child: Column(
// children: <Widget>[
// SizedBox(height: size.height * 0.03),
// Text('Home',
// textAlign: TextAlign.center,
// style: TextStyle(
// shadows: <Shadow>[
// Shadow(
// offset: Offset(2.0, 2.0),
// blurRadius: 7.0,
// color: Color.fromARGB(45, 0, 0, 0),
// ),
// ],
// //                    color: Colors.lightBlue,
// color: Colors.lightBlue,
// fontSize: 30.0,
// )),
// SizedBox(height: size.height * 0.03),
// Text('Eskalate LLC™. 2020 All Rights Reserved.',
// textAlign: TextAlign.center,
// style: TextStyle(
// color: Colors.black,
// fontSize: 24.0,
// )),
// Row(
// mainAxisAlignment: MainAxisAlignment.center,
// children: <Widget>[
// Icon(Icons.mail),
// Text("contact@eskalate.io", textAlign: TextAlign.right),
// ],
// ),
// Image.asset('assets/images/eskalate.png',
// width: 400, height: 210),
// ],
// ),
// ),
// ),
