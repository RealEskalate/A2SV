import 'package:cuberto_bottom_bar/cuberto_bottom_bar.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';

class MyApp extends StatelessWidget {
  // This widget is the root of your application.

  @override
  Widget build(BuildContext context) {
    // SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
    //     statusBarColor: Colors.black.withOpacity(1),
    //     statusBarIconBrightness: Brightness.light));
    return MaterialApp(
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  int currentPage;
  Color currentColor = Colors.lightBlue;
  Color inactiveColor = Colors.black;
  PageController tabBarController;
  List<Tabs> tabs = new List();

  @override
  void initState() {
    super.initState();
    currentPage = 0;
    tabs.add(Tabs(Icons.home, "Home", Colors.lightBlue,
        getGradient(Colors.lightBlueAccent)));
    tabs.add(Tabs(Icons.search, "Search", Colors.lightBlue,
        getGradient(Colors.lightBlue)));
    tabs.add(Tabs(
        Icons.alarm, "Alarm", Colors.lightBlue, getGradient(Colors.lightBlue)));
    tabs.add(Tabs(Icons.settings, "Settings", Colors.lightBlue,
        getGradient(Colors.lightBlue)));
    tabBarController = new PageController(initialPage: 0);
  }

  @override
  Widget build(BuildContext context) {
    Widget tabView({int destinationIndex}) {
      return Container(
          decoration: BoxDecoration(color: Colors.white),
          child: InkWell(
              child: Center(
                  child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Text(
                    tabs[currentPage].title,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 20.0,
                        fontWeight: FontWeight.w700),
                  ),
                  SizedBox(height: 4),
                  Text(
                    tabs[currentPage].title,
                    style: TextStyle(color: Colors.black, fontSize: 14.0),
                  ),
                ],
              )),
              onTap: () {
                setState(() {
                  currentPage = destinationIndex;
                  tabBarController.jumpToPage(currentPage);
                });
              }));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Home",
          style: TextStyle(
            color: Colors.black,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
      ),
      body: PageView(
          controller: tabBarController,
          physics: NeverScrollableScrollPhysics(),
          children: <Widget>[
            tabView(destinationIndex: 3),
            tabView(destinationIndex: 0),
            tabView(destinationIndex: 1),
            tabView(destinationIndex: 2)
          ]),
      // drawer: new Container(
      //     width: 250.0,
      //     // margin: EdgeInsets.only(bottom: 60.0),
      //     color: Colors.blue,
      //     child: ListView(
      //       children: <Widget>[Text("Hello"), Text("World")],
      //     )),
      bottomNavigationBar: CubertoBottomBar(
        key: Key("BottomBar"),
        inactiveIconColor: inactiveColor,
        tabStyle: CubertoTabStyle.STYLE_FADED_BACKGROUND,
        selectedTab: currentPage,
        tabs: tabs
            .map((value) => TabData(
                key: Key(value.title),
                iconData: value.icon,
                title: value.title,
                tabColor: value.color,
                tabGradient: value.gradient))
            .toList(),
        onTabChangedListener: (position, title, color) {
          setState(() {
            currentPage = position;
            tabBarController.jumpToPage(position);
          });
        },
      ),
    );
  }

  @override
  void dispose() {
    tabBarController.dispose();
    super.dispose();
  }
}

class Tabs {
  final IconData icon;
  final String title;
  final Color color;
  final Gradient gradient;

  Tabs(this.icon, this.title, this.color, this.gradient);
}

getGradient(Color color) {
  return LinearGradient(
      colors: [color.withOpacity(0.5), color.withOpacity(0.1)],
      stops: [0.0, 0.7]);
}
