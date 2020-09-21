// test result history of a person page
import 'package:flutter/material.dart';


class TestResultHistoryAppBar extends StatefulWidget {
  @override
  _TestResultHistoryAppBarState createState() => _TestResultHistoryAppBarState();
}

class _TestResultHistoryAppBarState extends State<TestResultHistoryAppBar> {


  @override
  Widget build(BuildContext context) {
    //SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle.dark.copyWith(statusBarColor: Colors.green));
    return Scaffold(
      appBar: AppBar(
        title: Text("Current Symptoms"),
        leading: IconButton(icon: Icon(Icons.arrow_back), onPressed: () {  },),
      ),
      body:
      TestResultHistory(),


    );
  }
}


class TestResultHistory extends StatefulWidget {
  @override
  _TestResultHistoryState createState() => _TestResultHistoryState();
}

class _TestResultHistoryState extends State<TestResultHistory> {
  //


  List dates_of_result_list = ["06/08/2020", "06/08/2020","06/08/2020","06/08/2020","06/08/2020","06/08/2020",];
  List results_list = ["Positive", "Positive","Positive", "Positive","Positive", "Positive" ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body:
          Center(
            child: ListView.builder(
              itemCount: 6,
              shrinkWrap: true,
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
                              padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
                              child: Text(dates_of_result_list[index], style: TextStyle(color: Colors.black)),
                            ),
                            SizedBox(width: 5.0,),


                          ],
                        ),
                        Container(
                          alignment: Alignment.center,
                          padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),

                          child: Text(results_list[index], style: TextStyle(color: Colors.black)),
                        ),

                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
      );
  }
}

