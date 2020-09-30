// test result history of a person page
import 'package:flutter/material.dart';
import '../../widgets/hexColorGenerator.dart';

class CurrentSymptomsAppBar extends StatefulWidget {
  @override
  _CurrentSymptomsAppBarState createState() => _CurrentSymptomsAppBarState();
}

class _CurrentSymptomsAppBarState extends State<CurrentSymptomsAppBar> {
  @override
  Widget build(BuildContext context) {
    //SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.green));
    return Scaffold(
      appBar: AppBar(
        title: Text("Current Symptoms"),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {},
        ),
      ),
      body: CurrentSymptoms(),
    );
  }
}

class CurrentSymptoms extends StatefulWidget {
  @override
  _CurrentSymptomsState createState() => _CurrentSymptomsState();
}

class _CurrentSymptomsState extends State<CurrentSymptoms> {
  //

  List dates_of_result_list = [
    "06/08/2020",
    "07/08/2020",
    "08/08/2020",
    "09/08/2020",
    "10/08/2020",
    "11/08/2020",
  ];
  List results_list = [
    "High Fever",
    "Ansomia",
    "Dry Cough",
    "Heavy Sweat",
    "Fatigue",
    "Heavy Breathing"
  ];

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        elevation: 1,
        backgroundColor: Colors.white,
        title: Center(
          child: Text(
            "Current Symptoms",
            style: TextStyle(
              color: Colors.grey,
            ),
          ),
        ),
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          iconSize: 30.0,
          color: Colors.grey,
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Container(
          height: size.height,
          decoration: BoxDecoration(
            color: HexColor("#F5F9FF"),
          ),
          child: ListView(children: <Widget>[
            Container(
              width: MediaQuery.of(context).size.width,
              decoration: BoxDecoration(
                color: Colors.transparent,
              ),
              padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Container(
                        alignment: Alignment.center,
                        padding: EdgeInsets.symmetric(
                            horizontal: 10.0, vertical: 10.0),
                        child: Text("Registry Date",
                            style: TextStyle(color: Colors.black)),
                      ),
                      SizedBox(
                        width: 5.0,
                      ),
                    ],
                  ),
                  Container(
                    alignment: Alignment.center,
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
                    child:
                        Text("Symptom", style: TextStyle(color: Colors.black)),
                  ),
                ],
              ),
            ),
            ListView.builder(
              itemCount: 6,
              scrollDirection: Axis.vertical,
              primary: false,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemBuilder: (BuildContext context, int index) => Container(
                width: MediaQuery.of(context).size.width,
                padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
                child: Card(
                  elevation: 2.0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0.0),
                  ),
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    padding:
                        EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: <Widget>[
                            Container(
                              alignment: Alignment.center,
                              padding: EdgeInsets.symmetric(
                                  horizontal: 10.0, vertical: 10.0),
                              child: Text(dates_of_result_list[index],
                                  style: TextStyle(color: Colors.black)),
                            ),
                            SizedBox(
                              width: 5.0,
                            ),
                          ],
                        ),
                        Container(
                          alignment: Alignment.center,
                          padding: EdgeInsets.symmetric(
                              horizontal: 10.0, vertical: 10.0),
                          child: Text(results_list[index],
                              style: TextStyle(color: Colors.black)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ])),
    );
  }
}
