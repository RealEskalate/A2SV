import '../../widgets/cardWidget.dart';
import '../../widgets/hexColorGenerator.dart';
import '../../widgets/graph.dart';
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
      decoration:
          BoxDecoration(color: HexColor("#F5F9FF")), // 0xff ... color hex code
      child: Container(
        padding: EdgeInsets.fromLTRB(0.0, size.height * 0.035, 0.0, 0.0),
        child: ListView(
          children: <Widget>[
            Container(
              margin: EdgeInsets.symmetric(horizontal: 20),
              child: Text("Your Covid Trends",
                  style: TextStyle(
                    color: HexColor("#0a6dc9"),
                    fontSize: 18.0,
                  )),
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
                    sizeWidth: 0.25,
                    color: Colors.green,
                    iconPath: "assets/images/recovered.png",
                    value: "172",
                    change: "+12",
                    text: "Recovered",
                    title: "this.title",
                    press: null),
                CardWidget(
                    sizeHeight: 0.15,
                    sizeWidth: 0.25,
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
                    sizeHeight: 0.2,
                    sizeWidth: 0.35,
                    color: Colors.orange[800],
                    iconPath: "assets/images/cases.png",
                    value: "1453",
                    change: "+25",
                    text: "Active Cases",
                    title: "this.title",
                    press: null),
                CardWidget(
                    sizeHeight: 0.2,
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
            Container(
              margin: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Text("Your patients' recovery so far",
                  style: TextStyle(
                    color: HexColor("#0a6dc9"),
                    fontSize: 18.0,
                  )),
            ),
            Container(
                margin: EdgeInsets.symmetric(horizontal: 20),
                height: 250,
                child: TimeSeriesBar.withRandomData()),
            SizedBox(height: 20)
          ],
        ),
      ),
    );
  }
}
