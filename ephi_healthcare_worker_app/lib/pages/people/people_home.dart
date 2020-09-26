//list of people page under the watch of health care worker app
import 'package:ephi_healthcare_worker_app/models/person.dart';
import 'package:ephi_healthcare_worker_app/pages/people/person_detail.dart';
import 'package:flutter/material.dart';

class PeoplePage extends StatelessWidget {
  List<Person> _people = [
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
    Person(name: 'Abel Tsegaye', status: 'recovered'),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(color: Color(0xFFD8ECF1)),
      child: Column(
        children: <Widget>[
          Container(
            height: 120,
            padding: EdgeInsets.all(10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Card(
                  child: Container(
                    height: 100,
                    padding: EdgeInsets.all(10.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Text(
                          "Total Patients",
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.blue,
                          ),
                        ),
                        Text(
                          "[+25]",
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.blue,
                          ),
                        ),
                        SizedBox(
                          height: 5,
                        ),
                        Text(
                          "7,278",
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.blue),
                        ),
                      ],
                    ),
                  ),
                ),
                Card(
                  child: Container(
                    height: 100,
                    padding: EdgeInsets.all(10.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Text(
                          "Active Patients",
                          style: TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.bold,
                            color: Colors.green,
                          ),
                        ),
                        Text(
                          "[+5]",
                          style: TextStyle(
                            fontSize: 15,
                            color: Colors.green,
                          ),
                        ),
                        SizedBox(
                          height: 5,
                        ),
                        Text(
                          "278",
                          style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.green),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: Container(
              child: ListView.builder(
                itemCount: _people.length,
                itemBuilder: (context, index) {
                  return Card(
                    child: ListTile(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) {
                              return PeopleDetail();
                            },
                          ),
                        );
                      },
                      title: (Text(
                        _people[index].name,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      )),
                      leading: Icon(
                        Icons.account_circle,
                        size: 40,
                        color: Colors.blue,
                      ),
                      subtitle: Text(_people[index].status),
                      trailing: Icon(Icons.arrow_forward_ios),
                    ),
                  );
                },
              ),
            ),
          )
        ],
      ),
    );
  }
}
