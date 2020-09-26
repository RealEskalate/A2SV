import 'package:ephi_healthcare_worker_app/widgets/cardWidget.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      color: new Color(0xfff0f4ff), // 0xff ... color hex code
      child: Container(
        padding: EdgeInsets.fromLTRB(0.0, size.height * 0.035, 0.0, 0.0),
        child: Column(
          // mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            Container(
              padding: EdgeInsets.fromLTRB(0.0, 0.0, 20.0, 0.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  Text("Your Covid Trends",
                      style: TextStyle(
                        color: Colors.lightBlue[800],
                        fontSize: 22.0,
                      )),
                  Text("Latest Update: 13 March",
                      style: TextStyle(
                        color: Colors.lightBlue[800],
                        fontSize: 8.0,
                      )),
                ],
              ),
            ),
            SizedBox(height: size.height * 0.02),
            Row(
              // mainAxisAlignment: MainAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.2,
                    color: Colors.lightBlue,
                    iconPath: "assets/images/covid.png",
                    value: "1453",
                    change: "+25",
                    text: "Covid+",
                    title: "this.title",
                    press: null),
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.2,
                    color: Colors.green,
                    iconPath: "assets/images/recovered.png",
                    value: "172",
                    change: "+12",
                    text: "Recovered",
                    title: "this.title",
                    press: null),
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.2,
                    color: Colors.red[300],
                    iconPath: "assets/images/deceased.png",
                    value: "335",
                    change: "+9",
                    text: "Deceased",
                    title: "this.title",
                    press: null),
              ],
            ),
            SizedBox(height: size.height * 0.03),
            Row(
              // mainAxisAlignment: MainAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.35,
                    color: Colors.orange[800],
                    iconPath: "assets/images/cases.png",
                    value: "1453",
                    change: "+25",
                    text: "Active Cases",
                    title: "this.title",
                    press: null),
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.35,
                    color: Colors.purple,
                    iconPath: "assets/images/symptoms.png",
                    value: "172",
                    change: "+12",
                    text: "Active Symptoms",
                    title: "this.title",
                    press: null),
              ],
            ),

          ],
        ),
      ),
    );
  }
}
