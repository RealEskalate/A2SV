//cases list page
import 'package:flutter/material.dart';
import '../../widgets/caseWidget.dart';
import '../../models/case.dart';
import '../../widgets/hexColorGenerator.dart';

class CasesList extends StatefulWidget {
  CasesList({this.scrollController});
  final ScrollController scrollController;
  @override
  CasesListState createState() => CasesListState(this.scrollController);
}

class CasesListState extends State<CasesList> {
  CasesListState(this.scrollController);
  //User user;
  final ScrollController scrollController;

  @override
  void initState() {
    super.initState();
  }

  List<Case> casesList = [
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
                //   elevation: 1,
                //   backgroundColor: Colors.white,
                //   title: Center(
                //     child: Text(
                //       "Cases",
                //       style: TextStyle(
                //         color: Colors.grey,
                //       ),
                //     ),
                //   ),
                //   leading: IconButton(
                //     icon: Icon(Icons.arrow_back),
                //     iconSize: 30.0,
                //     color: Colors.grey,
                //     onPressed: () {
                //       Navigator.pop(context);
                //     },
                //   ),
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
                                  Text("Total Cases",
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
                                  Text("Active Cases",
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
                    child: Text("Your cases",
                        style: TextStyle(
                          fontSize: 16,
                          color: HexColor("#0a6dc9"),
                        ))),
                SizedBox(height: 10),
                casesList.length == 0
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
                        itemCount: casesList.length,
                        itemBuilder: (BuildContext context, int index) {
                          return CaseWidget(
                            patient_case: casesList[index],
                          );
                        },
                      ),
                SizedBox(height: 20.2),
              ],
            )));
  }
}
