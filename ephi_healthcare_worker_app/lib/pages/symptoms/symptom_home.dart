// symptoms view page
import 'package:ephi_healthcare_worker_app/models/Symptom.dart';
import 'package:ephi_healthcare_worker_app/models/symptom_activity.dart';
import 'package:flutter/material.dart';

class SymptomView extends StatelessWidget {
  List<SymptomActivity> _curentActivity = [
    SymptomActivity(),
    SymptomActivity(),
    SymptomActivity(),
    SymptomActivity(),
    SymptomActivity(),
    SymptomActivity(),
    SymptomActivity()
  ];
  List<Symptom> _latestSymptoms = [
    Symptom(),
    Symptom(),
    Symptom(),
    Symptom(),
  ];
  Widget _buildSymptomsView(int index) {
    Symptom currentView = _latestSymptoms[index];
    return Container(
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[Text(currentView.name), Text(currentView.dateAdded)],
      ),
    );
  }

  Future<void> _showMyDialog(context) async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Latest Symptoms'),
          content: SingleChildScrollView(
              child: Column(
                  children: _latestSymptoms
                      .asMap()
                      .entries
                      .map((MapEntry map) => _buildSymptomsView(map.key))
                      .toList())),
          actions: <Widget>[
            FlatButton(
              child: Text(
                'close',
                // style: TextStyle(
                //   color: Colors.blue,
                // ),
              ),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return Container(
      decoration: BoxDecoration(color: Color(0xFFD8ECF1)),
      child: ListView(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Text(
              "SYMPTOMS",
              style: TextStyle(
                color: Colors.grey,
                fontSize: 18.0,
                fontWeight: FontWeight.w400,
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Container(
                height: 150,
                width: 150,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                  boxShadow: [BoxShadow(
                    color: Colors.black26,
                    offset:Offset(0.0,0.2),
                    blurRadius:6.0,
                  )]
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text(
                      "2345",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: 10,
                          width: 10,
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(5.0),
                          ),
                        ),
                        SizedBox(
                          width: 5,
                        ),
                        Text(
                          "Active",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
              SizedBox(
                width: 10.0,
              ),
              Container(
                height: 150,
                width: 150,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                  boxShadow: [BoxShadow(
                    color: Colors.black26,
                    offset:Offset(0.0,0.2),
                    blurRadius:6.0,
                  )]
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text(
                      "2345",
                      style: TextStyle(
                        fontSize: 30,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(
                      height: 5,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: 10,
                          width: 10,
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(5.0),
                          ),
                        ),
                        SizedBox(
                          width: 5,
                        ),
                        Text(
                          "Recovered",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
            child: Row(
              // mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Container(
                  width: (size.width / 3),
                  child: Text(
                    "DATE REGISTERY",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w400,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 1,
                  ),
                ),
                Container(
                  width: (size.width / 3),
                  child: Text(
                    "ACTIVITY",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
                 Text(
                    "NAME",
                    style: TextStyle(
                      color: Colors.grey,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
              ],
            ),
          ),
          Container(
            height: 300,
            child: ListView.builder(
              itemCount: _curentActivity.length,
              itemBuilder: (BuildContext context, int index) {
                return Container(
                  padding: EdgeInsets.symmetric(horizontal: 10.0),
                  margin: EdgeInsets.symmetric(vertical: 2.0, horizontal: 10.0),
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(5.0),
                    boxShadow: [BoxShadow(
                    color: Colors.black26,
                    offset: Offset(0.0,0.2),
                    blurRadius: 2.0,
                  )]
                  ),
                  child: Row(
                    // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[                      
                Container(
                  width: (size.width/3),
                  child:Text(_curentActivity[index].acticityDate),),
                      Container(
                  width: (size.width/3),
                        child: GestureDetector(
                          onTap: () {
                            _showMyDialog(context);
                          },
                          child: Text(
                            _curentActivity[index].activityType,
                            style: TextStyle(
                              color: Colors.blue,
                            ),
                          ),
                        ),
                      ),
                      GestureDetector(
                        child: Text(
                          _curentActivity[index].person,
                          style: TextStyle(
                            color: Colors.blue,
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
