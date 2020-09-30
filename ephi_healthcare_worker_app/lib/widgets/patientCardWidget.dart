import 'package:flutter/material.dart';
import '../models/case.dart';
import '../pages/details/detail_view.dart';
import '../pages/people/person_detail.dart';

class PatientCard extends StatefulWidget {
  Case patient_case;

  PatientCard({@required this.patient_case});
  @override
  _PatientCardState createState() =>
      _PatientCardState(patient_case: this.patient_case);
}

class _PatientCardState extends State<PatientCard> {
  _PatientCardState({this.patient_case});
  //Reply sampleReply;
  Case patient_case;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    var sizeH = MediaQuery.of(context).size.height;
    var sizeW = MediaQuery.of(context).size.width;
    return Container(
        margin: EdgeInsets.only(bottom: 5),
        child: Card(
            elevation: 2.0,
            child: Container(
                margin: EdgeInsets.all(3),
                child: ListTile(
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PatientDetailView(),
                    ),
                  ),
                  leading: CircleAvatar(
                    backgroundImage: AssetImage('assets/images/user1.jpg'),
                    maxRadius: 25,
                  ),
                  title: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(patient_case.currentTestResult,
                          style: TextStyle(
                            fontSize: 16,
                            color: patient_case.currentTestResult == "Positive"
                                ? Colors.red
                                : Colors.green,
                          )),
                      SizedBox(height: 5),
                      Text(patient_case.patientName),
                      SizedBox(height: 5),
                    ],
                  ),
                  dense: false,
                  trailing: InkWell(
                      onTap: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => PatientDetailView(),
                            ),
                          ),
                      child: Icon(Icons.arrow_forward_ios)),
                ))));
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
