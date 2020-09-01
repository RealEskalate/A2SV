import 'package:ephi_healthcare_worker_app/components/currentPages.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

// Drawer Widget
import 'drawer.dart';

class Home extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    return _HomeState();
  }
}

class _HomeState extends State<Home> {
  int _currentIndex = 0;
  final List<Widget> _children = [
    CurrentWidgets(Colors.blueGrey[100]),
    CurrentWidgets(Colors.deepOrange[100]),
    CurrentWidgets(Colors.green[100])
  ];

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      drawer: AppDrawer(),
      appBar: AppBar(
        title: Center(child: const Text('EPHI COVID-19 HOME')),
      ),
      body: _children[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: onTabTapped,
        // this will be set when a new tab is tapped
        currentIndex: _currentIndex,
        items: [
          BottomNavigationBarItem(
            icon: new Icon(Icons.home),
            title: new Text('Home'),
          ),
          BottomNavigationBarItem(
            icon: new Icon(Icons.mail),
            title: new Text('Messages'),
          ),
          BottomNavigationBarItem(
              icon: Icon(Icons.person), title: Text('Profile'))
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
