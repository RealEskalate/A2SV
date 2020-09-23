// page for symptom history of a person

import 'package:date_picker_timeline/date_picker_timeline.dart';
import 'package:flutter/material.dart';

class SymptomHistory extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: SymptomHistoryPage(title: 'Symptom History'),
    );
  }
}

class SymptomHistoryPage extends StatefulWidget {
  SymptomHistoryPage({Key key, this.title}) : super(key: key);
  final String title;

  @override
  _SymptomHistoryState createState() => _SymptomHistoryState();
}

class _SymptomHistoryState extends State<SymptomHistoryPage> {
  DatePickerController _controller = DatePickerController();

  DateTime _selectedValue = DateTime.now();

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        floatingActionButton: FloatingActionButton(
          child: Icon(Icons.replay),
          onPressed: () {
            // _controller.animateToSelection();

            _controller.animateToDate(DateTime.now());
          },
        ),
        appBar: AppBar(
          elevation: 1,
          backgroundColor: Colors.white,
          title: Center(
            child: Text(
              widget.title,
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
          ),
          leading: IconButton(
            icon: Icon(Icons.arrow_back),
            iconSize: 30.0,
            color: Colors.grey,
            onPressed: () {},
          ),
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.notifications),
              iconSize: 30.0,
              color: Colors.grey,
              onPressed: () {},
            ),
          ],
        ),
        body: SingleChildScrollView(
          child: Container(
            padding: EdgeInsets.all(10.0),
            color: Colors.white,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.all(10),
                  child: Text(
                    _selectedValue.toString().substring(0, 10),
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 15,
                    ),
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(10.0),
                    color: Colors.grey[100],
                  ),
                  child: DatePicker(
                    DateTime.now().subtract(Duration(
                        days:
                            14)), // here we changed the start date of the date picker
                    width: 60,
                    height: 80,
                    controller: _controller,
                    initialSelectedDate: DateTime.now(),
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
                      GestureDetector(
                        onTap: () => {
                          print("clicked card 1"),
                        },
                        child: Card(
                          elevation: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              color: Colors.grey[200],
                            ),
                            //alignment: Alignment.topLeft,
                            padding: EdgeInsets.fromLTRB(10, 25, 10, 25),
                            child: Column(
                              children: <Widget>[
                                Row(
                                  children: [
                                    Text(
                                      'Runny Nose',
                                      style: TextStyle(
                                        fontSize: 25.0,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'happens when excess fluid comes out of nose',
                                      style: TextStyle(
                                        fontSize: 15.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 10.0,
                      ),
                      GestureDetector(
                        onTap: () => {
                          print("clicked a card"),
                        },
                        child: Card(
                          elevation: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              color: Colors.grey[200],
                            ),
                            padding: EdgeInsets.fromLTRB(10, 25, 10, 25),
                            child: Column(
                              children: <Widget>[
                                Row(
                                  children: [
                                    Text(
                                      'Runny Nose',
                                      style: TextStyle(
                                        fontSize: 25.0,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'happens when excess fluid comes out of nose',
                                      style: TextStyle(
                                        fontSize: 15.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 10.0,
                      ),
                      GestureDetector(
                        onTap: () => {
                          print("clicked a card"),
                        },
                        child: Card(
                          elevation: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              color: Colors.grey[200],
                            ),
                            padding: EdgeInsets.fromLTRB(10, 25, 10, 25),
                            child: Column(
                              children: <Widget>[
                                Row(
                                  children: [
                                    Text(
                                      'Runny Nose',
                                      style: TextStyle(
                                        fontSize: 25.0,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'happens when excess fluid comes out of nose',
                                      style: TextStyle(
                                        fontSize: 15.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 10.0,
                      ),
                      GestureDetector(
                        onTap: () => {
                          print("clicked a card"),
                        },
                        child: Card(
                          elevation: 0,
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(15),
                              color: Colors.grey[200],
                            ),
                            padding: EdgeInsets.fromLTRB(10, 25, 10, 25),
                            child: Column(
                              children: <Widget>[
                                Row(
                                  children: [
                                    Text(
                                      'Runny Nose',
                                      style: TextStyle(
                                        fontSize: 25.0,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 5,
                                ),
                                Row(
                                  children: [
                                    Text(
                                      'happens when excess fluid comes out of nose',
                                      style: TextStyle(
                                        fontSize: 15.0,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
