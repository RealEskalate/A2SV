//cases list page
import 'package:flutter/material.dart';
import '../../widgets/patientCardWidget.dart';
import '../../models/case.dart';

class PatientsHome extends StatefulWidget {
  PatientsHome({this.scrollController});
  final ScrollController scrollController;
  @override
  PatientsHomeState createState() => PatientsHomeState(this.scrollController);
}

class PatientsHomeState extends State<PatientsHome> {
  PatientsHomeState(this.scrollController);
  //User user;
  final ScrollController scrollController;

  @override
  void initState() {
    super.initState();
  }

  List<Case> PatientsHome = [
    Case(
        patientName: "Michael Mulatu",
        patientPhone: "+251987674521",
        activeSymptoms: "Dry Cough, Ansomia, Fever",
        createdAt: "Jan 19,2020",
        creationTime: "5:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Daniel Debebe",
        patientPhone: "+251987674521",
        activeSymptoms: "Low Fever, Sneezing,  Dry Cough",
        createdAt: "Jan 20,2020",
        creationTime: "3:30 pm",
        currentTestResult: "Negative"),
    Case(
        patientName: "Sentayehu Natnael",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Ansomia, Sneezing",
        createdAt: "Jan 21,2020",
        creationTime: "4:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Natnael Hailu",
        patientPhone: "+251987674521",
        activeSymptoms: "Dry Cough, Shivering, Fever",
        createdAt: "Jan 22,2020",
        creationTime: "8:30 pm",
        currentTestResult: "Negative"),
    Case(
        patientName: "Hailu  Merga",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Hailu  Merga",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive"),
    Case(
        patientName: "Natnael  Sisay",
        patientPhone: "+251987674521",
        activeSymptoms: "High Fever, Sneezing, Dry Cough",
        createdAt: "Jan 25,2020",
        creationTime: "7:30 pm",
        currentTestResult: "Positive")
  ];

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () {
          Navigator.pop(context);
        },
        child: SafeArea(
            child: Scaffold(
                // appBar: AppBar(
                //   backgroundColor: new Color(0xfff8faf8),
                //   elevation: 1,
                //   title: Text(
                //     'Patients',
                //     style: TextStyle(color: Colors.black),
                //   ),
                //   iconTheme: IconThemeData(color: Colors.black),
                //   centerTitle: false,
                // ),
                body: Container(
                    decoration: BoxDecoration(color: HexColor("#F5F9FF")),
                    margin: EdgeInsets.symmetric(horizontal: 5),
                    child: Column(
                      children: <Widget>[
                        SizedBox(height: 10),
                        mainList(context),
                      ],
                    )))));
  }

  Future<void> refresh() async {}

  mainList(BuildContext context) {
    return Expanded(
        child: RefreshIndicator(
            onRefresh: refresh,
            child: ListView(
              children: <Widget>[
                Container(
                  height: 120,
                  child: Row(children: <Widget>[
                    Expanded(
                        child: Container(
                            margin: EdgeInsets.only(left: 5),
                            decoration: BoxDecoration(
                              color: Colors.transparent,
                              boxShadow: <BoxShadow>[
                                BoxShadow(
                                    offset: Offset(0.0, 4.0),
                                    blurRadius: 10.0,
                                    color:
                                        HexColor("#0a6dc9").withOpacity(0.2)),
                              ],
                            ),
                            child: Card(
                              child: Column(
                                children: <Widget>[
                                  SizedBox(height: 10),
                                  Text("Total Patients",
                                      style: TextStyle(
                                        fontSize: 20,
                                        color: HexColor("#0a6dc9"),
                                      )),
                                  SizedBox(height: 13),
                                  Text("[+25]",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: HexColor("#0a6dc9"),
                                      )),
                                  SizedBox(height: 13),
                                  Text("7,987",
                                      style: TextStyle(
                                        fontSize: 22,
                                        color: HexColor("#0a6dc9"),
                                      )),
                                  SizedBox(height: 10),
                                ],
                              ),
                            ))),
                    SizedBox(width: 10),
                    Expanded(
                        child: Container(
                            margin: EdgeInsets.only(right: 5),
                            decoration: BoxDecoration(
                              color: Colors.transparent,
                              boxShadow: <BoxShadow>[
                                BoxShadow(
                                    offset: Offset(0.0, 4.0),
                                    blurRadius: 10.0,
                                    color:
                                        HexColor("#06c219").withOpacity(0.2)),
                              ],
                            ),
                            child: Card(
                              child: Column(
                                children: <Widget>[
                                  SizedBox(height: 10),
                                  Text("Active Patients",
                                      style: TextStyle(
                                        fontSize: 20,
                                        color: HexColor("#06c219"),
                                      )),
                                  SizedBox(height: 13),
                                  Text("[+5]",
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: HexColor("#06c219"),
                                      )),
                                  SizedBox(height: 13),
                                  Text("1,109",
                                      style: TextStyle(
                                        fontSize: 20,
                                        color: HexColor("#06c219"),
                                      ))
                                ],
                              ),
                            )))
                  ]),
                ),
                SizedBox(height: 15),
                Container(
                    child: Text("Your patients",
                        style: TextStyle(
                          fontSize: 16,
                          color: HexColor("#0a6dc9"),
                        ))),
                SizedBox(height: 10),
                PatientsHome.length == 0
                    ? Container(
                        margin: EdgeInsets.only(top: 100),
                        child: Align(
                            alignment: Alignment.center,
                            child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  Icon(Icons.people_outline,
                                      size: 80,
                                      color: Theme.of(context).primaryColor),
                                  Text(
                                      "You haven't been assigned to any case yet!",
                                      style: TextStyle(
                                        fontSize: 22,
                                        color: Theme.of(context).primaryColor,
                                      ))
                                ])))
                    : ListView.builder(
                        //key: animatedListKey,
                        primary: false,
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        scrollDirection: Axis.vertical,
                        itemCount: PatientsHome.length,
                        itemBuilder: (BuildContext context, int index) {
                          return PatientCard(
                            patient_case: PatientsHome[index],
                          );
                        },
                      ),
                SizedBox(height: 20.2),
              ],
            )));
  }
}

class HexColor extends Color {
  static int _getColorFromHex(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll("#", "");
    if (hexColor.length == 6) {
      hexColor = "FF" + hexColor;
    }
    return int.parse(hexColor, radix: 16);
  }

  HexColor(final String hexColor) : super(_getColorFromHex(hexColor));
}
