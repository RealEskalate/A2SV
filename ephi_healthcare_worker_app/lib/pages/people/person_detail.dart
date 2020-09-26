// detail view for each person
import 'package:flutter/material.dart';

class PeopleDetail extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;

    return Scaffold(
      body: Container(
        color: Color(0xFFD8ECF1),
        padding: EdgeInsets.symmetric(vertical: 40, horizontal: 20),
        child: Column(
          children: <Widget>[
            Row(
              children: <Widget>[
                CircleAvatar(
                  backgroundColor: Colors.brown.shade700,
                  child: Text(
                    'AT',
                    style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
                  ),
                  radius: 50,
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Abel Tesegaye',
                        style: TextStyle(fontSize: 30, color: Colors.black),
                      ),
                      Text(
                        '21-30',
                        style: TextStyle(fontSize: 15, color: Colors.black54),
                      ),
                      Text(
                        'Male',
                        style: TextStyle(fontSize: 15, color: Colors.black54),
                      ),
                      Text(
                        'Test result: pending',
                        style: TextStyle(fontSize: 15, color: Colors.black54),
                      )
                    ],
                  ),
                )
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                ButtonTheme(
                  minWidth: size.width * 0.4,
                  height: size.width * 0.1,
                  child: RaisedButton(
                    color: Colors.lightBlueAccent[700],
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5)),
                    onPressed: () {},
                    child: Text('Message',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16.0,
                        )),
                  ),
                ),
                ButtonTheme(
                  minWidth: size.width * 0.4,
                  height: size.width * 0.1,
                  child: RaisedButton(
                    color: Colors.lightBlue[100],
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5)),
                    onPressed: () {},
                    child: Text('Contact',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: Colors.blue,
                          fontSize: 16.0,
                        )),
                  ),
                ),
              ],
            ),
            Divider(),
            Container(
                padding: EdgeInsets.symmetric(vertical: 10),
                child: Column(
                  children: <Widget>[
                    Card(
                      child: ListTile(
                        onTap: () {},
                        title: (Text(
                          'Current Symptoms',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                        leading: Icon(
                          Icons.timeline,
                          size: 40,
                          color: Colors.blue,
                        ),
                        trailing: Icon(Icons.arrow_forward_ios),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        onTap: () {},
                        title: (Text(
                          'Symptoms History',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                        leading: Icon(
                          Icons.timelapse,
                          size: 40,
                          color: Colors.blue,
                        ),
                        trailing: Icon(Icons.arrow_forward_ios),
                      ),
                    ),
                    Card(
                      child: ListTile(
                        onTap: () {},
                        title: (Text(
                          'Test Symptoms History',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        )),
                        leading: Icon(
                          Icons.report,
                          size: 40,
                          color: Colors.blue,
                        ),
                        trailing: Icon(Icons.arrow_forward_ios),
                      ),
                    ),
                  ],
                ))
          ],
        ),
      ),
    );
  }
}
