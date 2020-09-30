// page for symptom history of a person

import 'package:date_picker_timeline/date_picker_timeline.dart';
import 'package:flutter/material.dart';
import '../../widgets/hexColorGenerator.dart';

class SymptomHistory extends StatefulWidget {
  SymptomHistory({Key key}) : super(key: key);

  @override
  _SymptomHistoryState createState() => _SymptomHistoryState();
}

class _SymptomHistoryState extends State<SymptomHistory> {
  DatePickerController _controller = DatePickerController();

  DateTime _selectedValue = DateTime.now();

  @override
  void initState() {
    super.initState();
    //_controller.animateToDate(_selectedValue);
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.replay),
          onPressed: () {
            // _controller.animateToSelection();

            _controller
                .animateToDate(DateTime.now().subtract(Duration(days: 14)));
          },
        ),
        appBar: AppBar(
          elevation: 1,
          backgroundColor: Colors.white,
          title: Center(
            child: Text(
              "Symptom History",
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
        body: SingleChildScrollView(
          child: Container(
            height: size.height,
            decoration: BoxDecoration(
              color: HexColor("#F5F9FF"),
            ),
            // padding: EdgeInsets.symmetric(horizontal: 10.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                // Container(
                //   padding: EdgeInsets.all(10),
                //   child: Text(
                //     _selectedValue.toString().substring(0, 10),
                //     style: TextStyle(
                //       color: Colors.black,
                //       fontSize: 15,
                //     ),
                //   ),
                //   decoration: BoxDecoration(
                //     color: Colors.white,
                //     borderRadius: BorderRadius.circular(10),
                //   ),
                // ),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10.0),
                    color: Colors.white,
                  ),
                  child: DatePicker(
                    DateTime.now().subtract(Duration(
                        days:
                            14)), // here we changed the start date of the date picker
                    width: 60,
                    height: 80,
                    controller: _controller,
                    initialSelectedDate:
                        DateTime.now().subtract(Duration(days: 14)),
                    selectionColor: Colors.black,
                    selectedTextColor: Colors.white,

                    activeDates: [
                      DateTime.now().subtract(Duration(days: 14)),
                      DateTime.now().subtract(Duration(days: 13)),
                      DateTime.now().subtract(Duration(days: 12)),
                      DateTime.now().subtract(Duration(days: 11)),
                      DateTime.now().subtract(Duration(days: 10)),
                      DateTime.now().subtract(Duration(days: 9)),
                      DateTime.now().subtract(Duration(days: 8)),
                      DateTime.now().subtract(Duration(days: 7)),
                      DateTime.now().subtract(Duration(days: 6)),
                      DateTime.now().subtract(Duration(days: 5)),
                      DateTime.now().subtract(Duration(days: 4)),
                      DateTime.now().subtract(Duration(days: 3)),
                      DateTime.now().subtract(Duration(days: 2)),
                      DateTime.now().subtract(Duration(days: 1)),
                      DateTime.now().subtract(Duration(days: 0)),
                    ],
                    onDateChange: (date) {
                      // New date selected
                      setState(() {
                        _selectedValue = date;
                        print("yaaaaaayaya");
                      });
                    },
                  ),
                ),
                SizedBox(
                  height: 20.0,
                ),
                Container(
                  padding: EdgeInsets.fromLTRB(10, 0, 0, 5),
                  alignment: Alignment.topLeft,
                  child: Text(
                    "Symptoms",
                    textAlign: TextAlign.left,
                    style: TextStyle(
                      fontSize: 25,
                    ),
                  ),
                ),
                Container(
                  child: Column(
                    children: <Widget>[
                      symptomCardBuilder('Runny Nose',
                          'Happens when excess fluid comes out of nose'),
                      SizedBox(
                        height: 10.0,
                      ),
                      symptomCardBuilder('High Fever',
                          'Happens when excess fluid comes out of nose'),
                      SizedBox(
                        height: 10.0,
                      ),
                      symptomCardBuilder('Ansomia',
                          'Happens when excess fluid comes out of nose'),
                      SizedBox(
                        height: 10.0,
                      ),
                      symptomCardBuilder('Dry Cough',
                          'Happens when excess fluid comes out of nose'),
                      SizedBox(
                        height: 10.0,
                      ),
                      symptomCardBuilder('Tirdness',
                          'Happens when excess fluid comes out of nose'),
                      SizedBox(
                        height: 10.0,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ));
  }

  symptomCardBuilder(String symptomTitle, String symptomDesc) {
    return GestureDetector(
      onTap: () => {
        print("clicked card 1"),
      },
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 10),
        elevation: 2,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(25),
            color: Colors.white,
          ),

          //alignment: Alignment.topLeft,
          padding: EdgeInsets.symmetric(horizontal: 10, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                symptomTitle,
                style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
              ),
              SizedBox(
                height: 5,
              ),
              Text(
                symptomDesc,
                style: TextStyle(
                  fontSize: 15.0,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
