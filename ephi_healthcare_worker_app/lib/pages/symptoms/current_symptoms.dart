// page for current symptoms of person
import 'package:flutter/material.dart';

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

// Dummy data model
class Person {
  int id;
  String name;

  Person(this.id, this.name);

  static List<Person> getPersons() {
    return <Person>[
      Person(1, 'Name and 1'),
      Person(2, 'Name and 2'),
      Person(3, 'Name and 3'),
      Person(4, 'Name and 4'),
      Person(5, 'Name and 5'),
    ];
  }
}

class CurrentSymptoms extends StatefulWidget {
  @override
  _CurrentSymptomsState createState() => _CurrentSymptomsState();
}

class _CurrentSymptomsState extends State<CurrentSymptoms> {
  //
  List<Person> _person = Person.getPersons();
  List<DropdownMenuItem<Person>> _dropdownMenuItems;
  Person _selectedPerson;

  List dates_of_registered_symptom_list = [
    "06/08/2020",
    "06/08/2020",
    "06/08/2020",
    "06/08/2020",
    "06/08/2020",
    "06/08/2020",
  ];
  List symptoms_list = [
    "Positive",
    "Positive",
    "Positive",
    "Positive",
    "Positive",
    "Positive"
  ];
  List symptoms_list2 = [
    "Positive",
    "Positive",
    "Positive",
    "Positive",
    "Positive",
    "Positive"
  ];

  @override
  void initState() {
    _dropdownMenuItems = buildDropdownMenuItems(_person);
    _selectedPerson = _dropdownMenuItems[0].value;
    super.initState();
  }

  List<DropdownMenuItem<Person>> buildDropdownMenuItems(List persons) {
    List<DropdownMenuItem<Person>> items = List();
    for (Person person in persons) {
      items.add(DropdownMenuItem(
        value: person,
        child: Text(person.name),
      ));
    }
    return items;
  }

  onChangeDropDownItem(Person selectedPerson) {
    setState(() {
      _selectedPerson = selectedPerson;
      symptoms_list = [
        "Fever2",
        "dry cough2",
        "anomia2",
        "Fever2",
        "dry cough2",
        "anomia2"
      ];
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Center(
            child: Container(
              width: MediaQuery.of(context).size.width,
              padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
              margin: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    DropdownButton(
                      value: _selectedPerson,
                      items: _dropdownMenuItems,
                      onChanged: onChangeDropDownItem,
                    ),
                    RaisedButton(
                      onPressed: () {},
                      child: Text('Next Service'),
                      padding: EdgeInsets.symmetric(
                          horizontal: 10.0, vertical: 10.0),
                    )
                  ],
                ),
              ),
            ),
          ),
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
                              child: Text(
                                  dates_of_registered_symptom_list[index],
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
                          child: Text(symptoms_list[index],
                              style: TextStyle(color: Colors.black)),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
